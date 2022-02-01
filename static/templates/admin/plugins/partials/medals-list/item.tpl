<li data-type="item" class="list-group-item">
    <div class="row">
        <div class="col-xs-9">
            <div class="form-group">
                <label>Name: </label>
                <input placeholder="Name" value="{../name}" />
            </div>
            <div class="form-group">
                <label>Description: </label>
                <input placeholder="Description" value="{../description}" />
            </div>
            <div class="form-group">
                <label>Class: </label>
                <input placeholder="ex: .btn .btn-primary" value="{../class}" />
            </div>
            <div class="form-group">
                <label>Icon: </label>
                <button type="button" class="medal-icon"><i class="fa fa-nbb-none"></i></button>
            </div>
            <div class="form-group">
                <label for="iconColor">Icon color</label>
                <input data-settings="colorpicker" type="color" name="iconColor" title="Icon Color" class="form-control" placeholder="#fff" value="{{{ if ../iconColor }}}{../iconColor}{{{ else }}}#fff{{{ endif }}}" />
            </div>
            <div class="form-group">
                <label for="iconColor">Medal color</label>
                <input data-settings="colorpicker" type="color" name="medalColor" title="Medal Color" class="form-control" placeholder="#000" value="{{{ if ../medalColor }}}{../medalColor}{{{ else }}}#fff{{{ endif }}}" />
            </div>
        </div>
        <div class="col-xs-3 text-right">
            <button type="button" class="btn btn-info"><i class="fa fa-pen"></i></button>
            <button type="button" class="btn btn-danger"><i class="fa fa-trash"></i></button>
        </div>
    </div>
</li>