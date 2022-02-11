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

### Available only to admins (and sometimes global mods)
- `api.put('/medals', { medals: [] }, (err, response) => {});`
  - Used from the admin panel to update med available medals. Should be used elsewhere with care.
  - Returns the saved medals objects with `timestamp` and `uuid`.
  - Only available for admins
- `api.delete('/medals', { uuid }, (err) => {});`
  - Deletes a medal with provided `uid`
  - Also deleted all associated assignments
  - Only available for admins
- `api.post('/medals/user', { uuid, uid }, (err) => {});`
  - Assigns medal to user
  - Required `uuid` and `uid`
  - Return successful or error
  - Currently available to admins and global mods
- `api.delete('/medals/user', { uuid, uid }, (err) => {});`
  - Unassigns medal from user
  - Required `uuid` and `uid`
  - Return successful or error
  - Currently available to admins and global mods

## Improvements
I'm happy to receive suggestions on what I could do to improve on this plugin. These are the things that I want to do or feel I need to do.

- Template page where every medal is available to see. Sort of a gallery.
- Add WHEN a medal was awarded to a user. This is available but not implemented in UI.
- Allow users to show off their medals.
  - Next to their name in posts?
  - In their profile?
  - Page with recently assigned medals? Announcements.
- Create proper privileges for assigning medals.
  - Now only admins can create medals.
  - And global mods can assign/unassign.
- Upload custom icons if the Font Awesome library feels too limited.
- Custom content inside medal element?
  - HTML elements, code snippets etc?
- Notifiy a user when a medal has been assigned to them.
- System event to trace medal actions. (Assign/unassign in particular)