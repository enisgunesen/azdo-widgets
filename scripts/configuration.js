VSS.init({
	explicitNotifyLoaded: true,
	usePlatformStyles: true
});

function validatePatTextInput($patInput, $errorPat){
	if ($patInput.val() == ""){
		$errorPat.text("Please enter your PAT.");
		$errorPat.parent().css("visibility", "visible");
		return;
	}
	$errorPat.parent().css("visibility", "hidden");
	return true;
}

function validateselectWorkItemType($selectWorkItemType, $errorselectWorkItemType){					
	if ($selectWorkItemType.val().indexOf("None") > -1){
		$errorselectWorkItemType.text("Please select a valid Work Item Type");
		$errorselectWorkItemType.parent().css("visibility", "visible");
		return false;
	} 
	$errorselectWorkItemType.parent().css("visibility", "hidden");
	return true;
}

function validateselectPeriod($selectPeriod, $errorselectPeriod){					
	if ($selectPeriod.val().indexOf("None") > -1){
		$errorselectPeriod.text("Please select a valid period");
		$errorselectPeriod.parent().css("visibility", "visible");
		return false;
	} 
	$errorselectPeriod.parent().css("visibility", "hidden");
	return true;
}

function validateAreaPathTextInput($areapathInput, $errorareapath){
	if ($areapathInput.val() == ""){
		$errorareapath.text("Please enter your PAT.");
		$errorareapath.parent().css("visibility", "visible");
		return;
	}
	$errorareapath.parent().css("visibility", "hidden");
	return true;
}

function validateNameTextInput($nameInput, $errorSingleLineInput){
	if ($nameInput.val() == ""){
		$errorSingleLineInput.text("Please enter widget title.");
		$errorSingleLineInput.parent().css("visibility", "visible");
		return;
	}
	$errorSingleLineInput.parent().css("visibility", "hidden");
	return true;
}

function getCustomSettings(){
	var customSettings = {
		data: JSON.stringify({
            selectWorkItemType: $("#selectWorkItemType select").val(), 
            selectPeriod: $("#selectPeriod select").val(), 
            pat: $("#pat-input input").val(),
            areapath: $("#areapath-input input").val(),
			name: $("#name-input input").val()
        })
	};
	return customSettings;
}

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
	WidgetHelpers.IncludeWidgetConfigurationStyles();
	
	VSS.register("ArkasAggregateViewer-Configuration", function () {   
		var $patInput = $("#pat-input input");
		var $selectWorkItemType = $("#selectWorkItemType select");						
		var $selectPeriod = $("#selectPeriod select");
		var $areapath = $("#areapath-input input");
		var $nameInput = $("#name-input input");

		var $errorPat = $("#pat-input .validation-error > .validation-error-text");
		var $errorselectWorkItemType = $("#selectWorkItemType .validation-error > .validation-error-text");						
		var $errorselectPeriod = $("#selectPeriod .validation-error > .validation-error-text");						
		var $errorareapath = $("#areapath-input .validation-error > .validation-error-text");
		var $errorSingleLineInput = $("#name-input .validation-error > .validation-error-text");
		
		return {
			load: function (widgetSettings, widgetConfigurationContext) {
				var settings = JSON.parse(widgetSettings.customSettings.data);
				if (settings && settings.pat) {
                    $patInput.val(settings.pat);
                    $selectWorkItemType.val(settings.selectWorkItemType);
                    $selectPeriod.val(settings.selectPeriod);
                    $areapath.val(settings.areapath);
                    $nameInput.val(settings.name);
                }

				$patInput.on("input", function(){
					if (validatePatTextInput($patInput, $errorPat)){
						widgetConfigurationContext.notify(WidgetHelpers.WidgetEvent.ConfigurationChange, WidgetHelpers.WidgetEvent.Args(getCustomSettings()));
					} 
				});

                $selectWorkItemType.on("change", function () {
                   if (validateselectWorkItemType($selectWorkItemType, $errorselectWorkItemType)){
                       widgetConfigurationContext.notify(WidgetHelpers.WidgetEvent.ConfigurationChange, WidgetHelpers.WidgetEvent.Args(getCustomSettings()));
                   } 
                });

                $selectPeriod.on("change", function () {
					if (validateselectPeriod($selectPeriod, $errorselectPeriod)){
						widgetConfigurationContext.notify(WidgetHelpers.WidgetEvent.ConfigurationChange, WidgetHelpers.WidgetEvent.Args(getCustomSettings()));
					} 
				 });
				     
				$areapath.on("input", function(){
					if (validateAreaPathTextInput($areapath, $errorareapath)){
						widgetConfigurationContext.notify(WidgetHelpers.WidgetEvent.ConfigurationChange, WidgetHelpers.WidgetEvent.Args(getCustomSettings()));
					} 
				});       
												
				$nameInput.on("input", function(){
					if (validateNameTextInput($nameInput, $errorSingleLineInput)){
						widgetConfigurationContext.notify(WidgetHelpers.WidgetEvent.ConfigurationChange, WidgetHelpers.WidgetEvent.Args(getCustomSettings()));
					} 
				});

				return WidgetHelpers.WidgetStatusHelper.Success();
			},
			onSave: function() {
				
				var patValid = validatePatTextInput($patInput, $errorPat);
				var selectWorkItemTypeValid = validateselectWorkItemType($selectWorkItemType, $errorselectWorkItemType)
				var selectPeriodValid = validateselectPeriod($selectPeriod, $errorselectPeriod)
				var areapathValid = validateAreaPathTextInput($areapath, $errorareapath);
				var nameValid = validateNameTextInput($nameInput, $errorSingleLineInput);
				
				if (!patValid || !selectWorkItemTypeValid || !selectPeriodValid || !areapathValid || !nameValid){
					return WidgetHelpers.WidgetConfigurationSave.Invalid();
				}
											
				return WidgetHelpers.WidgetConfigurationSave.Valid(getCustomSettings());
			}
		}
	});
	
	
	VSS.notifyLoadSucceeded();
});