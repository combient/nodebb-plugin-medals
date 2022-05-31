<li data-type="item" class="list-group-item">
    <div class="row">
        <div class="col-xs-9">
            <table class="form-group info-table">
                <tr>
                    <td><label for="name">Name*: </label></td>
                    <td><input placeholder="Name" name="name" value="{../name}" /></td>
                </tr>
                <tr>
                    <td><label for="description">Description*: </label></td>
                    <td><textarea placeholder="Description" name="description">{../description}</textarea></td>
                </tr>
                <tr>
                    <td><label for="className">Classes: </label></td>
                    <td><input placeholder="ex: btn btn-primary" name="className" value="{../className}" /></td>
                </tr>
                <tr>
                    <td><label for="grouping">Grouping: </label></td>
                    <td>
                        <input placeholder="ex: 'mvp' or 'silly'" class="grouping" name="grouping" value="{../grouping}" />
                        <div class="options"></div>
                    </td>
                </tr>
            </table>
            <table class="form-group icon-color-table">
                <thead>
                    <tr>
                        <th><label>Icon*</label></th>
                        <th><label for="iconColor">Icon color</label></th>
                        <th><label for="medalColor">Medal color</label></th>
                    </tr>
                </thead>
                <tr>
                    <td>
                        <input type="hidden" value="{../icon}" name="icon" />
                        <button type="button" class="medal-icon" style="
                            color: {{{ if ../iconColor }}}{../iconColor}{{{ else }}}#fff{{{ endif }}};
                            background-color: {{{ if ../medalColor }}}{../medalColor}{{{ else }}}#fff{{{ endif }}};
                        "><i class="fa {{{ if ../icon }}}{../icon}{{{ else }}}fa-nbb-none{{{ endif }}}"
                                value="{../icon}"></i></button>
                    </td>
                    <td>
                        <input data-settings="colorpicker" type="color" name="iconColor" title="Icon Color"
                            class="form-control" placeholder="#fff"
                            value="{{{ if ../iconColor }}}{../iconColor}{{{ else }}}#fff{{{ endif }}}" />
                    </td>
                    <td>
                        <input data-settings="colorpicker" type="color" name="medalColor" title="Medal Color"
                            class="form-control" placeholder="#000"
                            value="{{{ if ../medalColor }}}{../medalColor}{{{ else }}}#fff{{{ endif }}}" />
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-xs-3 text-right">
            <input type="hidden" name="uuid" value="{../uuid}" />
            <input type="hidden" name="addedByUid" value="{../addedByUid}" />
            <input type="hidden" name="timestamp" value="{../timestamp}" />
            <button type="button" class="btn btn-danger" component="nodebb-plugin-medals/delete-medal"><i
                    class="fa fa-trash"></i></button>
        </div>
    </div>
    <div class="">
        <div class="panel-group" id="user-accordion-{../uuid}" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="user-heading-{../uuid}">
                    <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#user-accordion-{../uuid}" href="#user-collapse-{../uuid}"
                            aria-expanded="true" aria-controls="user-collapse-{../uuid}">
                            Users
                        </a>
                    </h4>
                </div>
                <div id="user-collapse-{../uuid}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="user-heading-{../uuid}">
                    <div class="panel-body">
                        <div class="row">
                            {{{ each ../users }}}
                                <div class="col-xs-12 col-sm-6 col-md-4">{buildAvatar(users, "sm", true)} <a href="/user/{users.userslug}/medals">{users.displayname}</a></div>
                            {{{ end }}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</li>
