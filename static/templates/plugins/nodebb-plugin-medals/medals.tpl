<div class="account nodebb-plugin-medals">
	<!-- IMPORT partials/account/header.tpl -->

	<div class="row">
		
	</div>
    {{{ if isAdminOrGlobalMod}}}
	<div class="row">
		<h2>Unassigned medals</h2>
        {{{ each unassignedMedals }}}
            <!-- IMPORT plugins/nodebb-plugin-medals/medal.tpl -->
        {{{ end }}}
	</div>
    {{{ endif isAdminOrGlobalMod}}}
</div>