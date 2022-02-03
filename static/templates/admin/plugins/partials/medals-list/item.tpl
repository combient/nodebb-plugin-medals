<li data-type="item" class="list-group-item">
    <div class="row">
        <div class="col-xs-9">
            <div class="form-group">
                <label>Name*: </label>
                <input placeholder="Name" name="name" value="{../name}" />
            </div>
            <div class="form-group">
                <label>Description*: </label>
                <input placeholder="Description" name="description" value="{../description}" />
            </div>
            <div class="form-group">
                <label>Class: </label>
                <input placeholder="ex: .btn .btn-primary" name="className" value="{../className}" />
            </div>
            <div class="form-group">
                <label>Icon*: </label>
                <input type="hidden" value="{../icon}" name="icon" />
                <button type="button" class="medal-icon"><i class="fa {{{ if ../icon }}}{../icon}{{{ else }}}fa-nbb-none{{{ endif }}}" value="{../icon}"></i></button>
            </div>
            <div class="form-group">
                <label for="iconColor">Icon color</label>
                <input data-settings="colorpicker" type="color" name="iconColor" title="Icon Color" class="form-control" placeholder="#fff" value="{{{ if ../iconColor }}}{../iconColor}{{{ else }}}#fff{{{ endif }}}" />
            </div>
            <div class="form-group">
                <label for="medalColor">Medal color</label>
                <input data-settings="colorpicker" type="color" name="medalColor" title="Medal Color" class="form-control" placeholder="#000" value="{{{ if ../medalColor }}}{../medalColor}{{{ else }}}#fff{{{ endif }}}" />
            </div>
        </div>
        <div class="col-xs-3 text-right">
            <input type="hidden" name="uuid" value="{../uuid}" />
            <button type="button" class="btn btn-danger" component="nodebb-plugin-medals/delete-medal"><i class="fa fa-trash"></i></button>
        </div>
    </div>
</li>