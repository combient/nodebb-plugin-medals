<div class="nodebb-plugin-medals medal-container col-xs-12 col-sm-6 col-md-4" data-uuid="{../uuid}">
    <div class="medal xl {../className} 
    {{{ if canFavourite }}} self {{{ endif }}} 
    {{{ if ../customIcon}}} custom-icon {{{ endif }}} 
    {{{ if ../noBackground }}} no-background {{{ endif }}}"
        style="color: {../iconColor}; background-color: {../medalColor}">
        <i class="fa {../icon}"></i>
        <img src="{../customIcon}" />
        <button class="btn-morph fab {{{ if ../favourite }}} heart {{{ else }}} plus {{{ endif }}}"
            title="Make favourite">
            <span>
                <span class="s1"></span>
                <span class="s2"></span>
                <span class="s3"></span>
            </span>
        </button>
    </div>
    <div class="name">
        <h3>
            {../name}
        </h3>
    </div>
    <div class="description">
        {../description}
    </div>
</div>