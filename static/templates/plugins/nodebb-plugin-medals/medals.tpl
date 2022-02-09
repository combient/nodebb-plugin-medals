<div class="account {{{ if isAdminOrGlobalMod }}}is-admin{{{ endif }}}">
	<!-- IMPORT partials/account/header.tpl -->

	<h2>Assigned medals</h2>
	<div id="assigned" class="row medals-row">
	</div>
    {{{ if isAdminOrGlobalMod}}}
	<h2>Unassigned medals</h2>
	<div id="unassigned" class="row unassigned-medals medals-row">
        {{{ each unassignedMedals }}}
            <!-- IMPORT plugins/nodebb-plugin-medals/medal.tpl -->
        {{{ end }}}
	</div>
    {{{ endif }}}
</div>