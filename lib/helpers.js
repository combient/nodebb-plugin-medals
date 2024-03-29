'use strict';

const { db, utils, User, Notifications, Plugins, Events, privilegeHelpers } = require('./nodebb');
const { PRIVILEGE_ASSIGN, PRIVILEGE_FAVOURITE } = require('./constants');

const Helpers = {};

const createMedalKey = uuid => (`nodebb-plugin-medals:medal:${uuid}`);
const createUserMedalsKey = uid => (`nodebb-plugin-medals:user-medals:${uid}`);
const createUserMedalDataKey = (uuid, uid) => (`nodebb-plugin-medals:user-medal-data:${uid}:${uuid}`);
const createAssignedMedalsListKey = uuid => `nodebb-plugin-medals:medal-users:${uuid}`;
const MEDALS_SET_KEY = 'nodebb-plugin-medals:medals';

Helpers.isValidMedalsObject = (medal) => {
	if (!medal.name ||
		!medal.description ||
		(!medal.icon && !medal.customIcon) ||
		!medal.addedByUid) {
		return false;
	}
	return true;
};

Helpers.createMedalsObject = async ({
	name,
	description,
	className,
	icon,
	iconColor,
	medalColor,
	addedByUid,
	uuid,
	timestamp,
	grouping,
	customIcon,
	noBackground
}) => ({
	name,
	description,
	className,
	icon,
	iconColor,
	medalColor,
	addedByUid,
	uuid: uuid || utils.generateUUID(),
	timestamp: timestamp || Date.now(),
	grouping,
	customIcon,
	noBackground
});

Helpers.assignMedalToUser = async (uuid, uid, callerUid) => {
	if (!uid || !uuid || !callerUid) throw new Error('User id or medal id not provided');

	const userMedalsKey = createUserMedalsKey(uid);
	const userMedals = await db.getSortedSetRange(userMedalsKey, 0, -1);
	if (userMedals.indexOf(uuid) > -1) throw new Error(`User with id ${uid} has already been assigned medal ${uuid}.`);

	const medalUsersListKey = createAssignedMedalsListKey(uuid);
	const userList = await db.getSortedSetRange(medalUsersListKey, 0, -1);
	if (userList.indexOf(uid) > -1) throw new Error(`User with id ${uid} has already been assigned medal ${uuid}.`);

	// Add medal uuid to users list
	await db.sortedSetAdd(userMedalsKey, Date.now(), uuid);
	// Add user to medals assignees list
	await db.sortedSetAdd(medalUsersListKey, Date.now(), uid);
	// Create user medal data object
	await Helpers.saveUserMedalData(uuid, uid);

	const medalData = await Helpers.getMedal(uuid);

	await Plugins.hooks.fire('action:nodebb-plugin-medals:assigned', { uid, caller: callerUid, medal: medalData });

	if (uid !== callerUid) {
		const userData = await User.getUserFields(uid, ['username', 'fullname', 'userslug']);
		const callerData = await User.getUserFields(callerUid, ['username', 'fullname', 'userslug']);
		const timestamp = Date.now();

		const notifObj = await Notifications.create({
			type: 'nodebb-plugin-medals-assign',
			bodyShort: `[[nodebb-plugin-medals:assign-notification, ${callerData.displayname}, ${medalData.name}]]`,
			uuid,
			from: callerUid,
			path: `/user/${userData.userslug}/medals`,
			nid: `nodebb-plugin-medals:assign:${uuid}:${uid}:${timestamp}`,
			medalName: medalData.name,
		});

		const response = await Plugins.hooks.fire('filter:nodebb-plugin-medals:notify', { notifObj });
		await Notifications.push(response.notifObj, [uid]);

		await Events.log({
			type: 'nodebb-plugin-medals:assign',
			uid: callerUid,
			medal: {
				uuid,
				user: {
					fullname: userData.fullname,
					username: userData.username,
					userslug: userData.userslug,
					uid,
				},
				name: medalData.name,
			},
		});
	}
};

Helpers.unassignMedalToUser = async (uuid, uid, callerUid) => {
	if (!uid || !uuid) throw new Error('User id or medal id not provided');

	const userMedalsKey = createUserMedalsKey(uid);
	const userMedals = await db.getSortedSetRange(userMedalsKey, 0, -1);
	if (userMedals.indexOf(uuid) === -1) throw new Error(`Unable to unassign medal ${uuid} from user with id ${uid} because it is not assigned to this users medals list.`);

	const medalUsersListKey = createAssignedMedalsListKey(uuid);
	const userList = await db.getSortedSetRange(medalUsersListKey, 0, -1);
	if (userList.indexOf(uid.toString()) === -1) throw new Error(`Unable to unassign medal ${uuid} from user with id ${uid} because it is not assigned to the medals user list.`);

	const userData = await User.getUserFields(uid, ['username', 'fullname', 'userslug']);
	const medalData = await Helpers.getMedal(uuid);

	await Plugins.hooks.fire('action:nodebb-plugin-medals:unassigned', { uid, caller: callerUid, medal: medalData });

	// Remove medal uuid from users list
	await db.sortedSetRemove(userMedalsKey, uuid);
	// Remove user from medals assignees list
	await db.sortedSetRemove(medalUsersListKey, uid);
	// Remove user medal data object
	await Helpers.deleteUserMedalData(uuid, uid);

	await Events.log({
		type: 'nodebb-plugin-medals:unassign',
		uid: callerUid,
		medal: {
			uuid,
			user: {
				fullname: userData.fullname,
				username: userData.username,
				userslug: userData.userslug,
				uid,
			},
			name: medalData.name,
		},
	});
};

Helpers.getUserMedals = async (uid) => {
	try {
		if (!uid) throw new Error('No uid provided. Cannot fetch user medals.');

		const userMedalsKey = createUserMedalsKey(uid);
		const uuids = await db.getSortedSetRange(userMedalsKey, 0, -1);
		const userMedals = await Helpers.getMedals(uuids);
		const userMedalData = await Promise.all(uuids.map(uuid => Helpers.getUserMedalData(uuid, uid)));

		const response = userMedals.map((medal, index) => {
			const data = userMedalData[index];
			data.assignedOnDate = new Date(data.assignedISO).toDateString();
			delete data.uuid;
			delete data.uid;

			return {
				...medal,
				...data,
			};
		})

		return response;
	} catch (error) {
		throw new Error(error.message);
	}
};

Helpers.getUsersMedals = async (uids) => {
	if (!uids) throw new Error('No uids provided. Cannot fetch medals.');

	const medals = await Promise.all(uids.map(uid => Helpers.getUserMedals(uid)));

	return medals;
};

Helpers.getMedal = async (uuid) => {
	if (!uuid) throw new Error('No uuid provided. Cannot fetch medal.');

	const medal = await db.getObject(createMedalKey(uuid));

	return medal;
};

Helpers.getMedals = async (uuids = []) => {
	const medals = await Promise.all(uuids.map(uuid => Helpers.getMedal(uuid)));

	return medals;
};

Helpers.getAllMedals = async () => {
	const uuids = await db.getSortedSetRange(MEDALS_SET_KEY, 0, -1);

	const medals = await Promise.all(uuids.map(uuid => db.getObject(createMedalKey(uuid))));

	return medals;
};

Helpers.getMedalUsers = async (uuid) => {
	const medalUsersListKey = createAssignedMedalsListKey(uuid);
	const uids = await db.getSortedSetRange(medalUsersListKey, 0, -1);
	const users = await User.getUsersFields(uids, ['username', 'fullname', 'userslug', 'picture']);
	return users;
};

Helpers.saveMedals = async (medalsData) => {
	const medalObjects = await Promise.all(medalsData.map(medalData => Helpers.saveMedal(medalData)));
	return medalObjects;
};

Helpers.saveMedal = async (medalData) => {
	const medalObject = await Helpers.createMedalsObject(medalData);
	if (!Helpers.isValidMedalsObject(medalObject)) throw new Error('Not all needed data provided.');

	const medal = await db.getObject(createMedalKey(medalData.uuid));

	if (!medal) {
		await db.sortedSetAdd(MEDALS_SET_KEY, medalObject.timestamp, medalObject.uuid);
	}

	await db.setObject(createMedalKey(medalObject.uuid), medalObject);

	return medalObject;
};

Helpers.deleteMedal = async (uuid) => {
	const medalUsersListKey = createAssignedMedalsListKey(uuid);
	const uids = await db.getSortedSetRange(medalUsersListKey, 0, -1);

	await Promise.all(uids.map((uid) => {
		const userMedalsKey = createUserMedalsKey(uid);
		return db.sortedSetRemove(userMedalsKey, uuid);
	}));

	await Promise.all(uids.map((uid) => {
		return Helpers.deleteUserMedalData(uuid, uid);
	}));

	await db.deleteAll([medalUsersListKey]);

	await db.delete(createMedalKey(uuid));
	await db.sortedSetRemove(MEDALS_SET_KEY, uuid);
};

// CREATE USER MEDAL DATA OBJECT
// USED TO STORE DATA ABOUT A USER/MEDAL RELATIONSHIP
Helpers.saveUserMedalData = async (uuid, uid) => {
	if (!uid || !uuid) throw new Error('Not all medal data received. Cannot save.');

	const userMedalDataKey = createUserMedalDataKey(uuid, uid);
	let medalData = await db.getObject(userMedalDataKey);

	if (!medalData) {
		medalData = {
			uid,
			uuid,
			favourite: false,
			assignedTimestamp: new Date().getTime()
		}
	}

	await db.setObject(userMedalDataKey, medalData);

	return medalData;
};

// UPDATE USER MEDAL DATA OBJECT
Helpers.updateUserMedalData = async (uuid, uid, data) => {
	try {
		if (!uid || !uuid) throw new Error('Not all medal data received. Cannot update.');

		const userMedalDataKey = createUserMedalDataKey(uuid, uid);
		const medalData = await db.getObject(userMedalDataKey);

		if (!medalData) {
			throw new Error('Unable to find user medal data.');
		}

		const payload = {
			uid: medalData.uid,
			uuid: medalData.uuid,
			favourite: typeof data.favourite === 'boolean' ? data.favourite : medalData.favourite,
			assignedTimestamp: data.assignedTimestamp || medalData.assignedTimestamp,
		};

		await db.setObject(userMedalDataKey, payload);

		return medalData;
	} catch (error) {
		throw new Error(error.message);
	}
};

Helpers.getUserMedalData = async (uuid, uid) => {
	if (!uid || !uuid) throw new Error('Not all medal data received. Cannot get.');

	const userMedalDataKey = createUserMedalDataKey(uuid, uid);
	const medalData = await db.getObject(userMedalDataKey);

	if (!medalData) {
		throw new Error('Unable to find user medal data.');
	}

	medalData.assignedISO = new Date(medalData.assignedTimestamp).toISOString();

	return medalData;
};

// DELETE USER MEDAL DATA OBJECT
Helpers.deleteUserMedalData = async (uuid, uid) => {
	if (!uid || !uuid) throw new Error('Not all medal data received. Cannot delete.');

	const userMedalDataKey = createUserMedalDataKey(uuid, uid);
	await db.delete(userMedalDataKey);
};

Helpers.favouriteMedal = async (uuid, uid) => {
	const payload = {
		favourite: true,
	};

	await Helpers.updateUserMedalData(uuid, uid, payload);
};

Helpers.unfavouriteMedal = async (uuid, uid) => {
	const payload = {
		favourite: false,
	};

	await Helpers.updateUserMedalData(uuid, uid, payload);
};

Helpers.canAssignMedals = async (uid) => {
	const [isAdmin, [canAssign]] = await Promise.all([
		User.isAdministrator(uid),
		privilegeHelpers.isAllowedTo([PRIVILEGE_ASSIGN], uid, 0)
	]);

	return canAssign || isAdmin;
};

Helpers.canFavouriteMedals = async (uid) => {
	const [isAdmin, [canFavourite]] = await Promise.all([
		User.isAdministrator(uid),
		privilegeHelpers.isAllowedTo([PRIVILEGE_FAVOURITE], uid, 0)
	]);

	return canFavourite || isAdmin;
};

module.exports = Helpers;
