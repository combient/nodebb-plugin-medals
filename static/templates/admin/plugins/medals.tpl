<form role="form" class="medals-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
				Adjust these settings. You can then retrieve these settings in code via:
				<code>const settings = await meta.settings.get('medals');</code>
			</p>
		</div>
	</div>

	<br />

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Medals</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<ul data-type="medals-list" class="list-group">
					<!-- IMPORT admin/plugins/partials/medals-list/list.tpl -->
				</ul>
				<button component="nodebb-plugin-medals/add-medal-btn" type="button" class="btn btn-info">Add Medal</button>
			</div>
		</div>
	</div>

	<br />
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
