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
                    <td><input placeholder="Description" name="description" value="{../description}" /></td>
                </tr>
                <tr>
                    <td><label for="className">Classes: </label></td>
                    <td><input placeholder="ex: btn btn-primary" name="className" value="{../className}" /></td>
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
                        "><i class="fa {{{ if ../icon }}}{../icon}{{{ else }}}fa-nbb-none{{{ endif }}}" value="{../icon}"></i></button>
                    </td>
                    <td>
                        <input data-settings="colorpicker" type="color" name="iconColor" title="Icon Color" class="form-control" placeholder="#fff" value="{{{ if ../iconColor }}}{../iconColor}{{{ else }}}#fff{{{ endif }}}" />
                    </td>
                    <td>
                        <input data-settings="colorpicker" type="color" name="medalColor" title="Medal Color" class="form-control" placeholder="#000" value="{{{ if ../medalColor }}}{../medalColor}{{{ else }}}#fff{{{ endif }}}" />
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-xs-3 text-right">
            <input type="hidden" name="uuid" value="{../uuid}" />
            <input type="hidden" name="addedByUid" value="{../addedByUid}" />
            <input type="hidden" name="timestamp" value="{../timestamp}" />
            <button type="button" class="btn btn-danger" component="nodebb-plugin-medals/delete-medal"><i class="fa fa-trash"></i></button>
        </div>
    </div>
</li>