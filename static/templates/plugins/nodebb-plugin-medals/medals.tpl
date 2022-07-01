<div class="account {{{ if canAssign }}}can-assign{{{ endif }}}">
    <h1 class="text-center">{title}</h1>
    <!-- IMPORT partials/account/header.tpl -->

    {{{ if canAssign }}}<h2>[[nodebb-plugin-medals:assigned]]</h2>{{{ endif }}}
    <div id="assigned" class="row medals-row">
        {{{ each assignedMedals }}}
        <!-- IMPORT plugins/nodebb-plugin-medals/medal.tpl -->
        {{{ end }}}
    </div>
    {{{ if canAssign}}}
    <h2>[[nodebb-plugin-medals:not-assigned]]</h2>
    <div id="unassigned" class="row unassigned-medals medals-row">
        {{{ each notAssignedMedals }}}
        <!-- IMPORT plugins/nodebb-plugin-medals/medal.tpl -->
        {{{ end }}}
    </div>
    {{{ endif }}}
</div>