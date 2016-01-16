//
//  JsInterface.swift
//  Trailers
//
//  Created by Robert Parnell on 16/01/2016.
//  Copyright © 2016 Robert Parnell. All rights reserved.
//

import Foundation
import TVMLKit

@objc protocol jsInterfaceProtocol : JSExport {
    func log(message: String) -> Void
}



class cJsInterface: NSObject, jsInterfaceProtocol {
    func log(message: String) -> Void {
        print(message);
      //  Debug.Log("JS: %@", message);
    }
}