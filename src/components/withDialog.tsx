import React, {useEffect, useState, useRef} from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, WikiInfo, JiraInfo } from "../state/Atoms";

const WithDialog = (Component: any, type: string) => { 
    const [data, setData] = useState<string>("");
    let xmlDoc = useRef<Document | null>(null);
    const pkgConfig = useRecoilValue(Config); 
    const [wikiInfo,] = useRecoilState(WikiInfo);

    // useEffect(() => {    
    //       if(type === "Wiki") {
    //         let parser = new DOMParser();
    //         xmlDoc.current = parser.parseFromString(
    //             pkgConfig.packageConfig,
    //             "text/xml"
    //         );  
    //       }              
    //   }, []);

    return ({fetchData: any, ...props}) => {        

        // fetchData = "";
        // if(props.show && type === "Wiki") {
        //     const _data = FetchData(xmlDoc, wikiInfo);
        //     setData(_data);
        // }

        return <Component {...props} />
    }    
}

export default WithDialog;