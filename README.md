# Medals plugin for **NodeBB**

Ever wanted to award your users with a special token of appreciation? Maybe she's a master of making that morning brew. Maybe they make everything run smoothly. Maybe he's always there when somebody needs a hug.

If you answered YES, then this plugin is for you.

## Installation

For best results, install `nodebb-plugin-medals` through the NodeBB Admin Panel.

## Creating medals

![Medal creation](/images/admin.png)

Navigate to your NodeBB admin panel and select *Medals* in the plugins dropdown. Here you can administrate your existing medals and see who you have awarded them to.

Everyone can see what medals have been awarded to a user at `/user/:userslug/medals`.

## API

### Available to anyone

A number of endpoints are exposed for your custom code. Use it with the `api` module.

- `api.get('/medals', {}, (err, response) => {});`
  - Get all available medals
- `api.get('/medals/user/:userslug', {}, (err, response) => {});`
  - Get all medals assigned to user
- `api.get('/plugins/medals/favourite/:uid', {}, (err, response= => {});`
  - Get a users favourite medal

### Available only to admins

- `api.put('/medals', { medals: [] }, (err, response) => {});`
  - Used from the admin panel to update available medals. Should be used elsewhere with care.
  - Returns the saved medals objects with `timestamp` and `uuid`.
- `api.delete('/medals', { uuid }, (err) => {});`
  - Deletes a medal with provided `uuid`
  - Also deletes all associated assignments

### Available to users who have been assigned certain privileges

- `api.post('/medals/user', { uuid, uid }, (err) => {});`
  - Assigns medal to user
  - Required `uuid` and `uid`
  - Return successful or error
- `api.delete('/medals/user', { uuid, uid }, (err) => {});`
  - Unassigns medal from user
  - Required `uuid` and `uid`
  - Return successful or error
- `api.post('/medals/user/favourite', { favourite: true/false, uuid, uid })`
  - Add medal to users favourites
  - Requires `favourite`, `uuid` and `uid`
  - Return successful or error
  - Also used when a user favourites his/her own medals

## Custom hooks

### Fetch medals of any user

If you want to fetch the medals of a user in code, the easiest way is to import the `Plugin` module from NodeBB like this, `const Plugins = require.main.require('./src/plugins'),`. Give it an object with the requested uid, and wait for the response. If the user has any assigned medals a list will be returned. See below:

```javascript
  const response = await Plugins.hooks.fire('filter:nodebb-plugin-medals/get-user-medals', { uid: user.uid });

  user.medals = response.medals;
```

### Fetch medals for a list of uids

Like above but provide a list of user ids. Like this:

```javascript
  const response = await Plugins.hooks.fire('filter:nodebb-plugin-medals/get-users-medals', { uids: listOfUids });

  for (let i = 0; i < users.length; i++) {
    users[i].medals = response.medals[i];
  }

```

### Medal assigned/unassigned

- `action:nodebb-plugin-medals:assigned`
- `action:nodebb-plugin-medals:unassigned`

Both these pass on the `uid` of the user, the `caller` uid and the medal data.

## Templates

There are a number of templates that can be utilized by your custom theme or plugin. They are:

- `<!-- IMPORT plugins/nodebb-plugin-medals/medal-xs.tpl -->`
- `<!-- IMPORT plugins/nodebb-plugin-medals/medal-sm.tpl -->`
- `<!-- IMPORT plugins/nodebb-plugin-medals/medal-md.tpl -->`
- `<!-- IMPORT plugins/nodebb-plugin-medals/medal-lg.tpl -->`
- `<!-- IMPORT plugins/nodebb-plugin-medals/medal-xl.tpl -->`

**And look like this:** ![Medal templates](images/medal-templates.png)

They are best used with a list of medals, like this:

```html
  {{{ each user.medals }}}
    <!-- IMPORT plugins/nodebb-plugin-medals/medal-xs.tpl -->
  {{{ end }}}
```

## Improvements

I'm happy to receive suggestions on what I could do to improve on this plugin. These are the things that I want to do or feel I need to do.

- Global template page where every medal is available to see. Sort of a gallery.
  - Maybe also who it has been awarded to.
- Allow users to show off their medals.
  - Next to their name in posts?
  - In their profile?
- Page with recently assigned medals? Announcements.
- Create proper privileges for assigning medals.
  - Now only admins can create medals. Maybe a system to suggest medals?
  - Privileges for individual users can be assigned to assign and favourite medals, but not yet groups.
