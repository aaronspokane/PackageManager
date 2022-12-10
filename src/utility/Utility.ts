import { Wiki} from "../models/Wiki";
import { XmlEdit } from "../models/XmlEdit";
import { Configuration } from "../models/Configuration";
import Constants from '../const/Constants';
import format from "xml-formatter";

export const GenerateWikiData = (xmlDoc: React.MutableRefObject<Document | null>, wikiInfo: Wiki) => {
    
    let _dataEvents = Array<string>();
    let _data = "";
    let _xmlEdit = new Array<XmlEdit>();
    let _configuration = new Array<Configuration>();
    let _registrationURL = "";
    let _webServiceName = "";
    let _assembly = "";
    let _objectType = "";
    let _objectMethod = "";
    let _assembly_comments = "";

    const dataEvents = xmlDoc.current!.querySelectorAll("DataEventTable");
    const _summary = wikiInfo.summary ? wikiInfo.summary : Constants.DEFULT_WIKI_SUMMARY;
    const _links = wikiInfo.specificationLink ? wikiInfo.specificationLink : Constants.DEFULT_WIKI_SPECIFICATION_LINK;   
    const _direction = wikiInfo.direction ? wikiInfo.direction : Constants.DEFULT_WIKI_SPECIFICATION_DIRECTION;  
    const _globalList = Array.from(xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]'));
    const _serviceList = Array.from(xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])'));
    const _allVariableList = Array.from(xmlDoc.current!.querySelectorAll('Variables Variable'));
    const _connectors = xmlDoc.current!.querySelectorAll('Connectors Connector'); 
    const _gvMaxLength =  Math.max(..._globalList.map(x => x.getAttribute("Name")!.length)); 
    const _gvMaxValueLength =  Math.max(..._globalList.map(x => x.getAttribute("Value")!.length));            
    const _svMaxLength =  Math.max(..._serviceList.map(x => x.getAttribute("Name")!.length));    
    const _svMaxValueLength =  Math.max(..._serviceList.map(x => x.getAttribute("Value")!.length)); 

    // toc
    _data = "{toc}\n\n";

    // image
    _data += "!nameOfImage.jpg!\n\n";

    // summary
    _data += "h1. Summary\n";
    _data += `${_summary}\n\n`;

    // specification links
    _data += "h1. Specification Links\n";
    _data += `${_links}\n\n`;

    // direction
    _data += "h1. Direction\n";
    _data += `${_direction}\n\n`;

    // workflow
    _data += "h1. WorkFlow\n";
    _data += `* Workflow adapters.\n\n`; 
    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 

    if(_connectors) {
        _connectors.forEach((node) => {
            let _id;
            let _description;
            let _comment;
            node.childNodes.forEach((item) => {
                if(item.nodeName === "SourceAdapter") {
                    let _firstType;
                    let _firstId;
                    let _firstComment;
                    item.childNodes.forEach((firstAdpater) => {
                        if(firstAdpater.nodeName === "Type" && firstAdpater.textContent !== "Event Pipe") {
                            _firstType = firstAdpater.textContent;                            
                        }
                        else if(firstAdpater.nodeName === "RegistrationURL" && firstAdpater.textContent !== "") {
                            _registrationURL = firstAdpater.textContent ?? "";
                        }
                        else if(firstAdpater.nodeName === "WebServiceName" && firstAdpater.textContent !== "") {
                            _webServiceName = firstAdpater.textContent ?? "";
                        }
                        else if(firstAdpater.nodeName === "Comments" && firstAdpater.textContent !== "") {
                            _firstComment = firstAdpater.textContent;
                        }
                        else if(firstAdpater.nodeName === "OutputDestMapping") {
                            const adapterId = Array.from(firstAdpater.childNodes);
                            if(adapterId) {
                                _firstId = adapterId.filter(x => x.nodeName === "ConnectorId")[0].textContent;
                            }
                        }
                    });

                    if(_firstId) {
                        _data += `ID: ${_firstId} - ${_firstType}: ${_firstComment}\n`;
                    }
                }

                if(item.nodeName === "Id") {
                    _id = item.textContent ?? "";
                }
                else if(item.nodeName === "Description") {
                    _description = item.textContent ?? "";
                }
                else if(item.nodeName === "DestinationAdapter") {
                    const _destinationAdapter = Array.from(item.childNodes);

                    const _type = _destinationAdapter.filter(x => x.nodeName === "Type");
                    if(_type && _type[0].textContent === "XmlEdit") {
                        const _xmlMap = _destinationAdapter.filter(x => x.nodeName === "XmlMap");
                        if(_xmlMap)
                        {
                            for (let item of _xmlMap) {
                                _xmlEdit.push(
                                    {
                                        description: _description,
                                        node: Array.from(item.childNodes).filter(x => x.nodeName === "Node")[0].textContent ?? "",
                                        value:  Array.from(item.childNodes).filter(x => x.nodeName === "Value")[0].textContent ?? "",
                                    }
                                )
                            }
                        }
                    }
                    else if(_type && _type[0].textContent === "Condition") {
                        const _xmlMap = _destinationAdapter.filter(x => x.nodeName === "Conditions");
                        const _compareType = _destinationAdapter.filter(x => x.nodeName === "CompareType")[0].textContent;
                        if(_xmlMap)
                        {
                            _configuration.push(
                                 {
                                    description: _description,
                                    valueA: Array.from(_xmlMap[0].childNodes).filter(x => x.nodeName === "ValueA")[0].textContent ?? "",
                                    valueB: Array.from(_xmlMap[0].childNodes).filter(x => x.nodeName === "ValueB")[0].textContent ?? "",
                                    operator: Array.from(_xmlMap[0].childNodes).filter(x => x.nodeName === "Operator")[0].textContent ?? "",
                                    compareType: _compareType ?? "",
                                 }
                            )
                        }
                    }
                    else if(_type && _type[0].textContent === "Library") {                        
                        _assembly = _destinationAdapter.filter(x => x.nodeName === "Assembly")[0].textContent ?? "";
                        _objectType =  _destinationAdapter.filter(x => x.nodeName === "ObjectType")[0].textContent ?? "";
                        _objectMethod  = _destinationAdapter.filter(x => x.nodeName === "ObjectMethod")[0].textContent ?? "";
                        _assembly_comments =  _destinationAdapter.filter(x => x.nodeName === "Comments")[0].textContent ?? "";
                    }

                    _comment = _destinationAdapter.filter(x => x.nodeName === "Comments")[0].textContent ?? "";                   
                }
            });  

            _data += `ID: ${_id} - ${_description}: ${_comment}\n`; 
    })}         
    
    _data += "{noformat}"; 
    _data += "\n\n";

    if(_xmlEdit?.length > 0) {
        // workflow edits
        _data += "h2. WorkFlow Edits\n";
        _data += "* Used when edits occur the the xml throughout the workflow\n\n";
        for(let key in _xmlEdit){
            _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
            _data += `Adapter: ${_xmlEdit[key].description}\n`;
            _data += `   ${_xmlEdit[key].node} = ${_xmlEdit[key].value}\n`;
            _data += "{noformat} \n\n"; 
        }
    }

    if(_configuration?.length > 0) {
        // workflow Conditions
        _data += "h2. WorkFlow Conditions\n";
        _data += "* Used when condition checks occur in the workflow\n\n";
        for(let key in _configuration){
            _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
            _data += `Adapter: ${_configuration[key].description}\n`;
            _data += `   ${_configuration[key].compareType}\n`;
            _data += `   {\n`;
            _data += `      ${_configuration[key].valueA} ${_configuration[key].operator} ${_configuration[key].valueB}\n`;
            _data += `   }\n`;
            _data += "{noformat} \n\n"; 
        }
    }
    
    // work flow service calls
    _data += `h2. WorkFlow Service Calls\n`;    
    _data += `* Used when this service makes a call to another service within the same package\n\n`;   
    _data += `${Constants.DEFAULT_WIKI_TEXT}\n\n`;     

    // configuration
    _data += `h1. Configuration\n`;  
    _data += `Provide values for:\n`;  
    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
    if(_allVariableList) {
        _allVariableList.forEach((node) => {
            const _value = node.getAttribute("Value");
            if(_value && _value.startsWith('[') && _value.endsWith("]"))
                _data += `   ${node.getAttribute("Name")}\n`; 
        });    
    }
    _data += "{noformat} \n\n"; 
    
    // technical details
    _data += `h1. Technical Details\n\n`; 
    _data += `h2. Variables\n`; 
    _data += `* List of vars and varx variables that need to be configured and what they relate to.\n\n`; 
    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 

    // instance vars
    _data += `* Instance\n\n`;     
      
    if(_globalList) {
        _globalList.forEach((node) => {
        const length = node.getAttribute("Name")!.length;
        const valueLength = node.getAttribute("Value")!.length;
        _data += node.getAttribute("Name") + ' '.repeat((_gvMaxLength - length) + 3) + node.getAttribute("Value") + ' '.repeat((_gvMaxValueLength - valueLength) + 3) + node.getAttribute("VariableDescription") + `\n`; 
    });
        _data += "{noformat}"; 
        _data += "\n\n"; 
    }

    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 

    // service vars
    _data += `* Service\n\n`;     

    if(_serviceList) {
        _serviceList.forEach((node) => {
            const length = node.getAttribute("Name")!.length;
            const valueLength = node.getAttribute("Value")!.length;
            _data += node.getAttribute("Name") + ' '.repeat((_svMaxLength - length) + 3) + node.getAttribute("Value") + ' '.repeat((_svMaxValueLength - valueLength) + 3) + node.getAttribute("VariableDescription") + `\n`; 
        });
        _data += "{noformat}"; 
        _data += "\n\n"; 
    } 

    if (!!dataEvents.length) { 
     // data events
     _data += "h2. Data Events\n"; 
     _data += "* List of Data Events used by the interface\n\n";  

      dataEvents.forEach(node => {            
          var formattedXml = format(node.outerHTML, {
              indentation: "  ",
              collapseContent: true,
              lineSeparator: "\n",
        });

        var tempData = "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
        tempData += "Custom Data Event:\n";

        _dataEvents.push(tempData + formattedXml + "\n{noformat}\n");
    }); 

    if(_dataEvents.length > 0)
        _data += _dataEvents.join('\n');
    } 

     // scripts  
     _data += "\nh2. Scripts\n";
     _data += "* Used when custom scripts are being used. Typically the case when custom staging tables are being created.\n\n";
     _data += "'''We were unable to find any information for this section, but you should double check in case we missed it'''";
 
     // sql statements  
     _data += "\n\nh2. SQL Statements\n";
     _data += "* Used when interface makes a complex query that needs to be documented\n\n";
     _data += "'''We were unable to find any information for this section, but you should double check in case we missed it'''\n\n"; 

     if(_registrationURL?.length > 0 && _webServiceName?.length > 0) {
        // web service  
        _data += "\n\nh1. Web Services\n";
        _data += "* When using web services fill out this section with the data on Web Services\n\n";
        _data += "h2. Outbound - WS Request\n"; 
        _data += "* Used when a library is making a request to an external web service.\n\n"; 
        _data += "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
        _data += "'''We were unable to find any information for this section, but you should double check in case we missed it'''\n"
        _data += "{noformat}\n\n"
        _data += "h2. Inbound - WS Request\n"; 
        _data += "* Used with Web Service Entry Point adapter for expected receive xml.\n\n"; 
        _data += "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
        _data += `RegistrationURL ${_registrationURL}\n`; 
        _data += `WebServiceName ${_webServiceName}\n\n`;
        _data += "* Expected Xml\n\n";
        _data += "<Enter expected xml here>\n";
        _data += "{noformat}\n\n"
        _data += "h2. Inbound - WS Response\n"; 
        _data += "* Used with Web Service Entry Point adapter for expected return xml.\n\n"; 
        _data += "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
        _data += "* On success\n\n";
        _data += "<Enter success xml here>\n\n";
        _data += "* On failure\n\n";
        _data += "<Enter failure xml here>\n";
        _data += "{noformat}\n\n"
    }
    
     if(_assembly) {
         // Library
        _data += "h2. Libraries\n";
        _data += "* Used when the service references an external library.\n\n";

        _data += "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
        _data += `Assembly   ${_assembly}\n`;
        _data += `Class      ${_objectType}\n`;
        _data += `Method     ${_objectMethod}\n`;
        _data += `Info       ${_assembly_comments}\n`;
        _data += "{noformat}\n\n"
     }

    return _data;
  }; 