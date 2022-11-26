import { Wiki} from "../models/Wiki";
import Constants from '../const/Constants';
import format from "xml-formatter";

export const GenerateWikiData = (xmlDoc: React.MutableRefObject<Document | null>, wikiInfo: Wiki) => {
    
    let _dataEvents = Array<string>();
    let _data = "";

    const dataEvents = xmlDoc.current!.querySelectorAll("DataEventTable");
    const _summary = wikiInfo.summary ? wikiInfo.summary : Constants.DEFAULT_WIKI_TEXT;
    const _links = wikiInfo.specificationLink ? wikiInfo.specificationLink : Constants.DEFAULT_WIKI_TEXT;   
    const _direction = wikiInfo.direction ? wikiInfo.direction : Constants.DEFAULT_WIKI_TEXT;  
    const globalList = Array.from(xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]'));
    const serviceList = Array.from(xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])'));
    const connectors = xmlDoc.current!.querySelectorAll('Connectors Connector');
    const gvMaxLength =  Math.max(...globalList.map(x => x.getAttribute("Name")!.length));            
    const svMaxLength =  Math.max(...serviceList.map(x => x.getAttribute("Name")!.length));     

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
    _data += `* Step by step play of what workflow does.\n\n`; 

    if(connectors) {
        connectors.forEach((node) => {
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
                    item.childNodes.forEach((comment) => {
                        if(comment.nodeName === "Comments") {
                            _comment = comment.textContent ?? "";
                        }
                    })
                }
            });  

            _data += `ID: ${_id} - ${_description}: ${_comment}\n`; 
    })}         
    
    _data += "{noformat}"; 
    _data += "\n\n";

    // technical details
    _data += `h1. Technical Details\n\n`; 
    _data += `h2. Variables\n`; 
    _data += `* List of vars and varx variables that need to be configured and what they relate to.\n\n`; 
    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
    // instance vars
    _data += `* Instance\n\n`;     
      
    if(globalList) {
        globalList.forEach((node) => {
        const length = node.getAttribute("Name")!.length;
        _data += node.getAttribute("Name") + ' '.repeat((gvMaxLength - length) + 3) + node.getAttribute("Value") + `\n`; 
    });
        _data += "{noformat}"; 
        _data += "\n\n"; 
    }

    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
    // service vars
    _data += `* Service\n\n`;     

    if(serviceList) {
        serviceList.forEach((node) => {
            const length = node.getAttribute("Name")!.length;
            _data += node.getAttribute("Name") + ' '.repeat((svMaxLength - length) + 3) + node.getAttribute("Value") + `\n`; 
        });
        _data += "{noformat}"; 
        _data += "\n\n"; 
    }

    // data events
    _data += "h2. Data Events\n"; 
    _data += "* List of Data Events used by the interface\n\n";  

    if (!!dataEvents.length) { 
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
    
    return _data;
  }; 