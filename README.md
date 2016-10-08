# leaflet-control-boxmenu
>


## Description
Create Leaflet Control in a box with optional icons and size-toggle. Is an extension of [fcoo/leaflet-control-box)[https://github.com/FCOO/leaflet-control-boxmenu]

Also supports `position: "topcenter"` and `position: "bottomcenter"` ([fcoo/leatlet-control-topcenter](https://github.com/FCOO/leaflet-control-topcenter)) 

## Installation
### bower
`bower install https://github.com/FCOO/leaflet-control-boxmenu.git --save`

## Demo
http://FCOO.github.io/leaflet-control-boxmenu/demo/ 

## Usage

    var myLeafletControlBox = new L.Control.Box( options );


### options

| Option | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| position | `string` | `"topright"` | leaflet code for the position of the control.<br>Also supports `"topcenter"` and `"bottomcenter"` |
| width | `number` | | The width of the control |
| height | `number` or `"auto"`<sup>1</sup>  | 0 | The height of the control. If "auto" the height is adjusted to the contents<sup>1</sup> |
| icon | `string` | `"plus"` | The name of the icon shown when the control is closed/hidden.<br>Possible values:`"plus"`, `"plus-box"`, `"minus"`, `"minus-box"`, `"zoom-in"`, `"zoom-out"`, `"map"`, `"clock"`, `"list"`, `"list2"`, `"menu"`, `"layers"`, `"settings"` |
| open | `boolean` | false | If true the control is open on load |
| onClose | `function` | null | Called when the control is closed |
| onOpen | `function` | null | Called when the control is opened |
| singleBoxMode | `boolean` or `function` | false | If true or returning true the control will hide all other leaflet-control-boxmenu when opened |
| extendable  | `boolean` or `function` | false | If true or returning true the box can be extended and diminish |
| extended | `boolean` | false | If true the control is extended on load |
| pinable<sup>1</sup> | `boolean` or `function` | false | If true or returning true the box and be pined in left or right side of the map | 
| pined<sup>1</sup> | `boolean` | false | If true the control is pined on load |


1: Only for `position:topleft`,  `position:topright`, or  `position:bottomcenter`

 
### Methods and attributes
#### $contentContainer
    myLeafletControlBox.$contentContainer.HTML("<b>This is the contents of the control</b>");
#### close()
	myLeafletControlBox.close()
#### open()
	myLeafletControlBox.open()

#### addContentsContainer( options )

	myLeafletControlBox.addContentsContainer( {height:"auto", width: 400, onlyExtended:false, neverExtended:false, className:''} );

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-control-boxmenu/LICENSE).

Copyright (c) 2015 [FCOO](https://github.com/FCOO)

## Contact information

[Niels Holt](http://github.com/NielsHolt)
