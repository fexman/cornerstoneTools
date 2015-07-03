var cornerstoneTools = (function ($, cornerstone, cornerstoneTools) {

    "use strict";

    if (cornerstoneTools === undefined) {
        cornerstoneTools = {};
    }

    function getOrientationMarkers(element) {
        var viewport = cornerstone.getViewport(element);
        var enabledElement = cornerstone.getEnabledElement(element);
        var imagePlaneMetaData = cornerstoneTools.metaData.get('imagePlane', enabledElement.image.imageId);

        var rowString = cornerstoneTools.orientation.getOrientationString(imagePlaneMetaData.rowCosines);
        var columnString = cornerstoneTools.orientation.getOrientationString(imagePlaneMetaData.columnCosines);

        var oppositeRowString = cornerstoneTools.orientation.invertOrientationString(rowString);
        var oppositeColumnString = cornerstoneTools.orientation.invertOrientationString(columnString);

        return {
            top: oppositeColumnString,
            bottom: columnString,
            left: oppositeRowString,
            right: rowString
        };
    }

    function getOrientationMarkerPositions(element) {
        var viewport = cornerstone.getViewport(element);
        var enabledElement = cornerstone.getEnabledElement(element);
        var coords;

        coords = {
            x: enabledElement.image.width / 2,
            y: 5
        };
        var topCoords = cornerstone.pixelToCanvas(element, coords);

        coords = {
            x: enabledElement.image.width / 2,
            y: enabledElement.image.height - 5
        };
        var bottomCoords = cornerstone.pixelToCanvas(element, coords);

        coords = {
            x: 5,
            y: enabledElement.image.height / 2
        };
        var leftCoords = cornerstone.pixelToCanvas(element, coords);

        coords = {
            x: enabledElement.image.width - 10,
            y: enabledElement.image.height / 2
        };
        var rightCoords = cornerstone.pixelToCanvas(element, coords);

        return {
            top: topCoords,
            bottom: bottomCoords,
            left: leftCoords,
            right: rightCoords
        };
    }

    function onImageRendered(e, eventData) {
        var element = eventData.element;

        var context = eventData.canvasContext.canvas.getContext("2d");
        context.setTransform(1, 0, 0, 1, 0, 0);

        var color = cornerstoneTools.toolColors.getToolColor();
        var font = cornerstoneTools.textStyle.getFont();
        var fontHeight = cornerstoneTools.textStyle.getFontSize();

        var markers = getOrientationMarkers(element);
        var coords = getOrientationMarkerPositions(element, markers);

        var textWidths = {
            top: context.measureText(markers.top).width,
            left: context.measureText(markers.left).width,
            right: context.measureText(markers.right).width,
            bottom: context.measureText(markers.bottom).width
        };

        cornerstoneTools.drawTextBox(context, markers.top, coords.top.x - textWidths.top / 2, coords.top.y, color);
        cornerstoneTools.drawTextBox(context, markers.left, coords.left.x - textWidths.left / 2, coords.left.y, color);

        cornerstoneTools.drawTextBox(context, markers.right, coords.right.x - textWidths.right / 2, coords.right.y, color);
        cornerstoneTools.drawTextBox(context, markers.bottom, coords.bottom.x - textWidths.bottom / 2, coords.bottom.y, color);

    }
    ///////// END IMAGE RENDERING ///////


    // module exports
    cornerstoneTools.orientationMarkers = cornerstoneTools.displayTool(onImageRendered);

    return cornerstoneTools;
}($, cornerstone, cornerstoneTools));
