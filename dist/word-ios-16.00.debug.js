/* Word iOS-specific API library */
/* Version: 16.0.8117.3000 */

/* Office.js Version: 16.0.8118.1000 */ 
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

/*
* @overview es6-promise - a tiny implementation of Promises/A+.
* @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
* @license   Licensed under MIT license
*            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
* @version   2.3.0
*/

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var OfficeExt;
(function (OfficeExt) {
	var MicrosoftAjaxFactory=(function () {
		function MicrosoftAjaxFactory() {
		}
		MicrosoftAjaxFactory.prototype.isMsAjaxLoaded=function () {
			if (typeof (Sys) !=='undefined' && typeof (Type) !=='undefined' &&
				Sys.StringBuilder && typeof (Sys.StringBuilder)==="function" &&
				Type.registerNamespace && typeof (Type.registerNamespace)==="function" &&
				Type.registerClass && typeof (Type.registerClass)==="function" &&
				typeof (Function._validateParams)==="function" &&
				Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof (Sys.Serialization.JavaScriptSerializer.serialize)==="function") {
				return true;
			}
			else {
				return false;
			}
		};
		MicrosoftAjaxFactory.prototype.loadMsAjaxFull=function (callback) {
			var msAjaxCDNPath=(window.location.protocol.toLowerCase()==='https:' ? 'https:' : 'http:')+'//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js';
			OSF.OUtil.loadScript(msAjaxCDNPath, callback);
		};
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxError", {
			get: function () {
				if (this._msAjaxError==null && this.isMsAjaxLoaded()) {
					this._msAjaxError=Error;
				}
				return this._msAjaxError;
			},
			set: function (errorClass) {
				this._msAjaxError=errorClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxString", {
			get: function () {
				if (this._msAjaxString==null && this.isMsAjaxLoaded()) {
					this._msAjaxString=String;
				}
				return this._msAjaxString;
			},
			set: function (stringClass) {
				this._msAjaxString=stringClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxDebug", {
			get: function () {
				if (this._msAjaxDebug==null && this.isMsAjaxLoaded()) {
					this._msAjaxDebug=Sys.Debug;
				}
				return this._msAjaxDebug;
			},
			set: function (debugClass) {
				this._msAjaxDebug=debugClass;
			},
			enumerable: true,
			configurable: true
		});
		return MicrosoftAjaxFactory;
	})();
	OfficeExt.MicrosoftAjaxFactory=MicrosoftAjaxFactory;
})(OfficeExt || (OfficeExt={}));
var OsfMsAjaxFactory=new OfficeExt.MicrosoftAjaxFactory();
var OSF=OSF || {};
var OfficeExt;
(function (OfficeExt) {
	var SafeStorage=(function () {
		function SafeStorage(_internalStorage) {
			this._internalStorage=_internalStorage;
		}
		SafeStorage.prototype.getItem=function (key) {
			try {
				return this._internalStorage && this._internalStorage.getItem(key);
			}
			catch (e) {
				return null;
			}
		};
		SafeStorage.prototype.setItem=function (key, data) {
			try {
				this._internalStorage && this._internalStorage.setItem(key, data);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.clear=function () {
			try {
				this._internalStorage && this._internalStorage.clear();
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.removeItem=function (key) {
			try {
				this._internalStorage && this._internalStorage.removeItem(key);
			}
			catch (e) {
			}
		};
		SafeStorage.prototype.getKeysWithPrefix=function (keyPrefix) {
			var keyList=[];
			try {
				var len=this._internalStorage && this._internalStorage.length || 0;
				for (var i=0; i < len; i++) {
					var key=this._internalStorage.key(i);
					if (key.indexOf(keyPrefix)===0) {
						keyList.push(key);
					}
				}
			}
			catch (e) {
			}
			return keyList;
		};
		return SafeStorage;
	})();
	OfficeExt.SafeStorage=SafeStorage;
})(OfficeExt || (OfficeExt={}));
OSF.XdmFieldName={
	ConversationUrl: "ConversationUrl",
	AppId: "AppId"
};
OSF.WindowNameItemKeys={
	BaseFrameName: "baseFrameName",
	HostInfo: "hostInfo",
	XdmInfo: "xdmInfo",
	SerializerVersion: "serializerVersion",
	AppContext: "appContext"
};
OSF.OUtil=(function () {
	var _uniqueId=-1;
	var _xdmInfoKey='&_xdm_Info=';
	var _serializerVersionKey='&_serializer_version=';
	var _xdmSessionKeyPrefix='_xdm_';
	var _serializerVersionKeyPrefix='_serializer_version=';
	var _fragmentSeparator='#';
	var _fragmentInfoDelimiter='&';
	var _classN="class";
	var _loadedScripts={};
	var _defaultScriptLoadingTimeout=30000;
	var _safeSessionStorage=null;
	var _safeLocalStorage=null;
	var _rndentropy=new Date().getTime();
	function _random() {
		var nextrand=0x7fffffff * (Math.random());
		nextrand ^=_rndentropy ^ ((new Date().getMilliseconds()) << Math.floor(Math.random() * (31 - 10)));
		return nextrand.toString(16);
	}
	;
	function _getSessionStorage() {
		if (!_safeSessionStorage) {
			try {
				var sessionStorage=window.sessionStorage;
			}
			catch (ex) {
				sessionStorage=null;
			}
			_safeSessionStorage=new OfficeExt.SafeStorage(sessionStorage);
		}
		return _safeSessionStorage;
	}
	;
	function _reOrderTabbableElements(elements) {
		var bucket0=[];
		var bucketPositive=[];
		var i;
		var len=elements.length;
		var ele;
		for (i=0; i < len; i++) {
			ele=elements[i];
			if (ele.tabIndex) {
				if (ele.tabIndex > 0) {
					bucketPositive.push(ele);
				}
				else if (ele.tabIndex===0) {
					bucket0.push(ele);
				}
			}
			else {
				bucket0.push(ele);
			}
		}
		bucketPositive=bucketPositive.sort(function (left, right) {
			var diff=left.tabIndex - right.tabIndex;
			if (diff===0) {
				diff=bucketPositive.indexOf(left) - bucketPositive.indexOf(right);
			}
			return diff;
		});
		return [].concat(bucketPositive, bucket0);
	}
	;
	return {
		set_entropy: function OSF_OUtil$set_entropy(entropy) {
			if (typeof entropy=="string") {
				for (var i=0; i < entropy.length; i+=4) {
					var temp=0;
					for (var j=0; j < 4 && i+j < entropy.length; j++) {
						temp=(temp << 8)+entropy.charCodeAt(i+j);
					}
					_rndentropy ^=temp;
				}
			}
			else if (typeof entropy=="number") {
				_rndentropy ^=entropy;
			}
			else {
				_rndentropy ^=0x7fffffff * Math.random();
			}
			_rndentropy &=0x7fffffff;
		},
		extend: function OSF_OUtil$extend(child, parent) {
			var F=function () { };
			F.prototype=parent.prototype;
			child.prototype=new F();
			child.prototype.constructor=child;
			child.uber=parent.prototype;
			if (parent.prototype.constructor===Object.prototype.constructor) {
				parent.prototype.constructor=parent;
			}
		},
		setNamespace: function OSF_OUtil$setNamespace(name, parent) {
			if (parent && name && !parent[name]) {
				parent[name]={};
			}
		},
		unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent) {
			if (parent && name && parent[name]) {
				delete parent[name];
			}
		},
		loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs) {
			if (url && callback) {
				var doc=window.document;
				var _loadedScriptEntry=_loadedScripts[url];
				if (!_loadedScriptEntry) {
					var script=doc.createElement("script");
					script.type="text/javascript";
					_loadedScriptEntry={ loaded: false, pendingCallbacks: [callback], timer: null };
					_loadedScripts[url]=_loadedScriptEntry;
					var onLoadCallback=function OSF_OUtil_loadScript$onLoadCallback() {
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						_loadedScriptEntry.loaded=true;
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					var onLoadError=function OSF_OUtil_loadScript$onLoadError() {
						delete _loadedScripts[url];
						if (_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					if (script.readyState) {
						script.onreadystatechange=function () {
							if (script.readyState=="loaded" || script.readyState=="complete") {
								script.onreadystatechange=null;
								onLoadCallback();
							}
						};
					}
					else {
						script.onload=onLoadCallback;
					}
					script.onerror=onLoadError;
					timeoutInMs=timeoutInMs || _defaultScriptLoadingTimeout;
					_loadedScriptEntry.timer=setTimeout(onLoadError, timeoutInMs);
					script.setAttribute("crossOrigin", "anonymous");
					script.src=url;
					doc.getElementsByTagName("head")[0].appendChild(script);
				}
				else if (_loadedScriptEntry.loaded) {
					callback();
				}
				else {
					_loadedScriptEntry.pendingCallbacks.push(callback);
				}
			}
		},
		loadCSS: function OSF_OUtil$loadCSS(url) {
			if (url) {
				var doc=window.document;
				var link=doc.createElement("link");
				link.type="text/css";
				link.rel="stylesheet";
				link.href=url;
				doc.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		parseEnum: function OSF_OUtil$parseEnum(str, enumObject) {
			var parsed=enumObject[str.trim()];
			if (typeof (parsed)=='undefined') {
				OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:"+str);
				throw OsfMsAjaxFactory.msAjaxError.argument("str");
			}
			return parsed;
		},
		delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache() {
			var obj={ calc: arguments[0] };
			return function () {
				if (obj.calc) {
					obj.val=obj.calc.apply(this, arguments);
					delete obj.calc;
				}
				return obj.val;
			};
		},
		getUniqueId: function OSF_OUtil$getUniqueId() {
			_uniqueId=_uniqueId+1;
			return _uniqueId.toString();
		},
		formatString: function OSF_OUtil$formatString() {
			var args=arguments;
			var source=args[0];
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10)+1;
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		},
		generateConversationId: function OSF_OUtil$generateConversationId() {
			return [_random(), _random(), (new Date()).getTime().toString()].join('_');
		},
		getFrameName: function OSF_OUtil$getFrameName(cacheKey) {
			return _xdmSessionKeyPrefix+cacheKey+this.generateConversationId();
		},
		addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue) {
			return OSF.OUtil.addInfoAsHash(url, _xdmInfoKey, xdmInfoValue, false);
		},
		addSerializerVersionAsHash: function OSF_OUtil$addSerializerVersionAsHash(url, serializerVersion) {
			return OSF.OUtil.addInfoAsHash(url, _serializerVersionKey, serializerVersion, true);
		},
		addInfoAsHash: function OSF_OUtil$addInfoAsHash(url, keyName, infoValue, encodeInfo) {
			url=url.trim() || '';
			var urlParts=url.split(_fragmentSeparator);
			var urlWithoutFragment=urlParts.shift();
			var fragment=urlParts.join(_fragmentSeparator);
			var newFragment;
			if (encodeInfo) {
				newFragment=[keyName, encodeURIComponent(infoValue), fragment].join('');
			}
			else {
				newFragment=[fragment, keyName, infoValue].join('');
			}
			return [urlWithoutFragment, _fragmentSeparator, newFragment].join('');
		},
		parseHostInfoFromWindowName: function OSF_OUtil$parseHostInfoFromWindowName(skipSessionStorage, windowName) {
			return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.HostInfo);
		},
		parseXdmInfo: function OSF_OUtil$parseXdmInfo(skipSessionStorage) {
			var xdmInfoValue=OSF.OUtil.parseXdmInfoWithGivenFragment(skipSessionStorage, window.location.hash);
			if (!xdmInfoValue) {
				xdmInfoValue=OSF.OUtil.parseXdmInfoFromWindowName(skipSessionStorage, window.name);
			}
			return xdmInfoValue;
		},
		parseXdmInfoFromWindowName: function OSF_OUtil$parseXdmInfoFromWindowName(skipSessionStorage, windowName) {
			return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.XdmInfo);
		},
		parseXdmInfoWithGivenFragment: function OSF_OUtil$parseXdmInfoWithGivenFragment(skipSessionStorage, fragment) {
			return OSF.OUtil.parseInfoWithGivenFragment(_xdmInfoKey, _xdmSessionKeyPrefix, false, skipSessionStorage, fragment);
		},
		parseSerializerVersion: function OSF_OUtil$parseSerializerVersion(skipSessionStorage) {
			var serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(skipSessionStorage, window.location.hash);
			if (isNaN(serializerVersion)) {
				serializerVersion=OSF.OUtil.parseSerializerVersionFromWindowName(skipSessionStorage, window.name);
			}
			return serializerVersion;
		},
		parseSerializerVersionFromWindowName: function OSF_OUtil$parseSerializerVersionFromWindowName(skipSessionStorage, windowName) {
			return parseInt(OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.SerializerVersion));
		},
		parseSerializerVersionWithGivenFragment: function OSF_OUtil$parseSerializerVersionWithGivenFragment(skipSessionStorage, fragment) {
			return parseInt(OSF.OUtil.parseInfoWithGivenFragment(_serializerVersionKey, _serializerVersionKeyPrefix, true, skipSessionStorage, fragment));
		},
		parseInfoFromWindowName: function OSF_OUtil$parseInfoFromWindowName(skipSessionStorage, windowName, infoKey) {
			try {
				var windowNameObj=JSON.parse(windowName);
				var infoValue=windowNameObj !=null ? windowNameObj[infoKey] : null;
				var osfSessionStorage=_getSessionStorage();
				if (!skipSessionStorage && osfSessionStorage && windowNameObj !=null) {
					var sessionKey=windowNameObj[OSF.WindowNameItemKeys.BaseFrameName]+infoKey;
					if (infoValue) {
						osfSessionStorage.setItem(sessionKey, infoValue);
					}
					else {
						infoValue=osfSessionStorage.getItem(sessionKey);
					}
				}
				return infoValue;
			}
			catch (Exception) {
				return null;
			}
		},
		parseInfoWithGivenFragment: function OSF_OUtil$parseInfoWithGivenFragment(infoKey, infoKeyPrefix, decodeInfo, skipSessionStorage, fragment) {
			var fragmentParts=fragment.split(infoKey);
			var infoValue=fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
			if (decodeInfo && infoValue !=null) {
				if (infoValue.indexOf(_fragmentInfoDelimiter) >=0) {
					infoValue=infoValue.split(_fragmentInfoDelimiter)[0];
				}
				infoValue=decodeURIComponent(infoValue);
			}
			var osfSessionStorage=_getSessionStorage();
			if (!skipSessionStorage && osfSessionStorage) {
				var sessionKeyStart=window.name.indexOf(infoKeyPrefix);
				if (sessionKeyStart > -1) {
					var sessionKeyEnd=window.name.indexOf(";", sessionKeyStart);
					if (sessionKeyEnd==-1) {
						sessionKeyEnd=window.name.length;
					}
					var sessionKey=window.name.substring(sessionKeyStart, sessionKeyEnd);
					if (infoValue) {
						osfSessionStorage.setItem(sessionKey, infoValue);
					}
					else {
						infoValue=osfSessionStorage.getItem(sessionKey);
					}
				}
			}
			return infoValue;
		},
		getConversationId: function OSF_OUtil$getConversationId() {
			var searchString=window.location.search;
			var conversationId=null;
			if (searchString) {
				var index=searchString.indexOf("&");
				conversationId=index > 0 ? searchString.substring(1, index) : searchString.substr(1);
				if (conversationId && conversationId.charAt(conversationId.length - 1)==='=') {
					conversationId=conversationId.substring(0, conversationId.length - 1);
					if (conversationId) {
						conversationId=decodeURIComponent(conversationId);
					}
				}
			}
			return conversationId;
		},
		getInfoItems: function OSF_OUtil$getInfoItems(strInfo) {
			var items=strInfo.split("$");
			if (typeof items[1]=="undefined") {
				items=strInfo.split("|");
			}
			if (typeof items[1]=="undefined") {
				items=strInfo.split("%7C");
			}
			return items;
		},
		getXdmFieldValue: function OSF_OUtil$getXdmFieldValue(xdmFieldName, skipSessionStorage) {
			var fieldValue='';
			var xdmInfoValue=OSF.OUtil.parseXdmInfo(skipSessionStorage);
			if (xdmInfoValue) {
				var items=OSF.OUtil.getInfoItems(xdmInfoValue);
				if (items !=undefined && items.length >=3) {
					switch (xdmFieldName) {
						case OSF.XdmFieldName.ConversationUrl:
							fieldValue=items[2];
							break;
						case OSF.XdmFieldName.AppId:
							fieldValue=items[1];
							break;
					}
				}
			}
			return fieldValue;
		},
		validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback) {
			var e=Function._validateParams(arguments, [{ name: "params", type: Object, mayBeNull: false },
				{ name: "expectedProperties", type: Object, mayBeNull: false },
				{ name: "callback", type: Function, mayBeNull: true }
			]);
			if (e)
				throw e;
			for (var p in expectedProperties) {
				e=Function._validateParameter(params[p], expectedProperties[p], p);
				if (e)
					throw e;
			}
		},
		writeProfilerMark: function OSF_OUtil$writeProfilerMark(text) {
			if (window.msWriteProfilerMark) {
				window.msWriteProfilerMark(text);
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		outputDebug: function OSF_OUtil$outputDebug(text) {
			if (typeof (OsfMsAjaxFactory) !=='undefined' && OsfMsAjaxFactory.msAjaxDebug && OsfMsAjaxFactory.msAjaxDebug.trace) {
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes) {
			descriptor=descriptor || {};
			for (var nd in attributes) {
				var attribute=attributes[nd];
				if (descriptor[attribute]==undefined) {
					descriptor[attribute]=true;
				}
			}
			Object.defineProperty(obj, prop, descriptor);
			return obj;
		},
		defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes) {
			descriptors=descriptors || {};
			for (var prop in descriptors) {
				OSF.OUtil.defineNondefaultProperty(obj, prop, descriptors[prop], attributes);
			}
			return obj;
		},
		defineEnumerableProperty: function OSF_OUtil$defineEnumerableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["enumerable"]);
		},
		defineEnumerableProperties: function OSF_OUtil$defineEnumerableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["enumerable"]);
		},
		defineMutableProperty: function OSF_OUtil$defineMutableProperty(obj, prop, descriptor) {
			return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["writable", "enumerable", "configurable"]);
		},
		defineMutableProperties: function OSF_OUtil$defineMutableProperties(obj, descriptors) {
			return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["writable", "enumerable", "configurable"]);
		},
		finalizeProperties: function OSF_OUtil$finalizeProperties(obj, descriptor) {
			descriptor=descriptor || {};
			var props=Object.getOwnPropertyNames(obj);
			var propsLength=props.length;
			for (var i=0; i < propsLength; i++) {
				var prop=props[i];
				var desc=Object.getOwnPropertyDescriptor(obj, prop);
				if (!desc.get && !desc.set) {
					desc.writable=descriptor.writable || false;
				}
				desc.configurable=descriptor.configurable || false;
				desc.enumerable=descriptor.enumerable || true;
				Object.defineProperty(obj, prop, desc);
			}
			return obj;
		},
		mapList: function OSF_OUtil$MapList(list, mapFunction) {
			var ret=[];
			if (list) {
				for (var item in list) {
					ret.push(mapFunction(list[item]));
				}
			}
			return ret;
		},
		listContainsKey: function OSF_OUtil$listContainsKey(list, key) {
			for (var item in list) {
				if (key==item) {
					return true;
				}
			}
			return false;
		},
		listContainsValue: function OSF_OUtil$listContainsElement(list, value) {
			for (var item in list) {
				if (value==list[item]) {
					return true;
				}
			}
			return false;
		},
		augmentList: function OSF_OUtil$augmentList(list, addenda) {
			var add=list.push ? function (key, value) { list.push(value); } : function (key, value) { list[key]=value; };
			for (var key in addenda) {
				add(key, addenda[key]);
			}
		},
		redefineList: function OSF_Outil$redefineList(oldList, newList) {
			for (var key1 in oldList) {
				delete oldList[key1];
			}
			for (var key2 in newList) {
				oldList[key2]=newList[key2];
			}
		},
		isArray: function OSF_OUtil$isArray(obj) {
			return Object.prototype.toString.apply(obj)==="[object Array]";
		},
		isFunction: function OSF_OUtil$isFunction(obj) {
			return Object.prototype.toString.apply(obj)==="[object Function]";
		},
		isDate: function OSF_OUtil$isDate(obj) {
			return Object.prototype.toString.apply(obj)==="[object Date]";
		},
		addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener) {
			if (element.addEventListener) {
				element.addEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.attachEvent) {
				element.attachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=listener;
			}
		},
		removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener) {
			if (element.removeEventListener) {
				element.removeEventListener(eventName, listener, false);
			}
			else if ((Sys.Browser.agent===Sys.Browser.InternetExplorer) && element.detachEvent) {
				element.detachEvent("on"+eventName, listener);
			}
			else {
				element["on"+eventName]=null;
			}
		},
		getCookieValue: function OSF_OUtil$getCookieValue(cookieName) {
			var tmpCookieString=RegExp(cookieName+"[^;]+").exec(document.cookie);
			return tmpCookieString.toString().replace(/^[^=]+./, "");
		},
		xhrGet: function OSF_OUtil$xhrGet(url, onSuccess, onError) {
			var xmlhttp;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp.responseText);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		xhrGetFull: function OSF_OUtil$xhrGetFull(url, oneDriveFileName, onSuccess, onError) {
			var xmlhttp;
			var requestedFileName=oneDriveFileName;
			try {
				xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function () {
					if (xmlhttp.readyState==4) {
						if (xmlhttp.status==200) {
							onSuccess(xmlhttp, requestedFileName);
						}
						else {
							onError(xmlhttp.status);
						}
					}
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
			catch (ex) {
				onError(ex);
			}
		},
		encodeBase64: function OSF_Outil$encodeBase64(input) {
			if (!input)
				return input;
			var codex="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/=";
			var output=[];
			var temp=[];
			var index=0;
			var c1, c2, c3, a, b, c;
			var i;
			var length=input.length;
			do {
				c1=input.charCodeAt(index++);
				c2=input.charCodeAt(index++);
				c3=input.charCodeAt(index++);
				i=0;
				a=c1 & 255;
				b=c1 >> 8;
				c=c2 & 255;
				temp[i++]=a >> 2;
				temp[i++]=((a & 3) << 4) | (b >> 4);
				temp[i++]=((b & 15) << 2) | (c >> 6);
				temp[i++]=c & 63;
				if (!isNaN(c2)) {
					a=c2 >> 8;
					b=c3 & 255;
					c=c3 >> 8;
					temp[i++]=a >> 2;
					temp[i++]=((a & 3) << 4) | (b >> 4);
					temp[i++]=((b & 15) << 2) | (c >> 6);
					temp[i++]=c & 63;
				}
				if (isNaN(c2)) {
					temp[i - 1]=64;
				}
				else if (isNaN(c3)) {
					temp[i - 2]=64;
					temp[i - 1]=64;
				}
				for (var t=0; t < i; t++) {
					output.push(codex.charAt(temp[t]));
				}
			} while (index < length);
			return output.join("");
		},
		getSessionStorage: function OSF_Outil$getSessionStorage() {
			return _getSessionStorage();
		},
		getLocalStorage: function OSF_Outil$getLocalStorage() {
			if (!_safeLocalStorage) {
				try {
					var localStorage=window.localStorage;
				}
				catch (ex) {
					localStorage=null;
				}
				_safeLocalStorage=new OfficeExt.SafeStorage(localStorage);
			}
			return _safeLocalStorage;
		},
		convertIntToCssHexColor: function OSF_Outil$convertIntToCssHexColor(val) {
			var hex="#"+(Number(val)+0x1000000).toString(16).slice(-6);
			return hex;
		},
		attachClickHandler: function OSF_Outil$attachClickHandler(element, handler) {
			element.onclick=function (e) {
				handler();
			};
			element.ontouchend=function (e) {
				handler();
				e.preventDefault();
			};
		},
		getQueryStringParamValue: function OSF_Outil$getQueryStringParamValue(queryString, paramName) {
			var e=Function._validateParams(arguments, [{ name: "queryString", type: String, mayBeNull: false },
				{ name: "paramName", type: String, mayBeNull: false }
			]);
			if (e) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: Parameters cannot be null.");
				return "";
			}
			var queryExp=new RegExp("[\\?&]"+paramName+"=([^&#]*)", "i");
			if (!queryExp.test(queryString)) {
				OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: The parameter is not found.");
				return "";
			}
			return queryExp.exec(queryString)[1];
		},
		isiOS: function OSF_Outil$isiOS() {
			return (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
		},
		isChrome: function OSF_Outil$isChrome() {
			return (window.navigator.userAgent.indexOf("Chrome") > 0) && !OSF.OUtil.isEdge();
		},
		isEdge: function OSF_Outil$isEdge() {
			return window.navigator.userAgent.indexOf("Edge") > 0;
		},
		isIE: function OSF_Outil$isIE() {
			return window.navigator.userAgent.indexOf("Trident") > 0;
		},
		isFirefox: function OSF_Outil$isFirefox() {
			return window.navigator.userAgent.indexOf("Firefox") > 0;
		},
		shallowCopy: function OSF_Outil$shallowCopy(sourceObj) {
			if (sourceObj==null) {
				return null;
			}
			else if (!(sourceObj instanceof Object)) {
				return sourceObj;
			}
			else if (Array.isArray(sourceObj)) {
				var copyArr=[];
				for (var i=0; i < sourceObj.length; i++) {
					copyArr.push(sourceObj[i]);
				}
				return copyArr;
			}
			else {
				var copyObj=sourceObj.constructor();
				for (var property in sourceObj) {
					if (sourceObj.hasOwnProperty(property)) {
						copyObj[property]=sourceObj[property];
					}
				}
				return copyObj;
			}
		},
		createObject: function OSF_Outil$createObject(properties) {
			var obj=null;
			if (properties) {
				obj={};
				var len=properties.length;
				for (var i=0; i < len; i++) {
					obj[properties[i].name]=properties[i].value;
				}
			}
			return obj;
		},
		addClass: function OSF_OUtil$addClass(elmt, val) {
			if (!OSF.OUtil.hasClass(elmt, val)) {
				var className=elmt.getAttribute(_classN);
				if (className) {
					elmt.setAttribute(_classN, className+" "+val);
				}
				else {
					elmt.setAttribute(_classN, val);
				}
			}
		},
		hasClass: function OSF_OUtil$hasClass(elmt, clsName) {
			var className=elmt.getAttribute(_classN);
			return className && className.match(new RegExp('(\\s|^)'+clsName+'(\\s|$)'));
		},
		focusToFirstTabbable: function OSF_OUtil$focusToFirstTabbable(all, backward) {
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findNextPos=function (allLen, currPos, backward) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && backward) {
					return -1;
				}
				else if (currPos===allLen - 1 && !backward) {
					return -1;
				}
				if (backward) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			next=backward ? all.length - 1 : 0;
			if (all.length===0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				window.focus();
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, backward);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		},
		focusToNextTabbable: function OSF_OUtil$focusToNextTabbable(all, curr, shift) {
			var currPos;
			var next;
			var focused=false;
			var candidate;
			var setFlag=function (e) {
				focused=true;
			};
			var findCurrPos=function (all, curr) {
				var i=0;
				for (; i < all.length; i++) {
					if (all[i]===curr) {
						return i;
					}
				}
				return -1;
			};
			var findNextPos=function (allLen, currPos, shift) {
				if (currPos < 0 || currPos > allLen) {
					return -1;
				}
				else if (currPos===0 && shift) {
					return -1;
				}
				else if (currPos===allLen - 1 && !shift) {
					return -1;
				}
				if (shift) {
					return currPos - 1;
				}
				else {
					return currPos+1;
				}
			};
			all=_reOrderTabbableElements(all);
			currPos=findCurrPos(all, curr);
			next=findNextPos(all.length, currPos, shift);
			if (next < 0) {
				return null;
			}
			while (!focused && next >=0 && next < all.length) {
				candidate=all[next];
				candidate.addEventListener('focus', setFlag);
				candidate.focus();
				candidate.removeEventListener('focus', setFlag);
				next=findNextPos(all.length, next, shift);
				if (!focused && candidate===document.activeElement) {
					focused=true;
				}
			}
			if (focused) {
				return candidate;
			}
			else {
				return null;
			}
		}
	};
})();
OSF.OUtil.Guid=(function () {
	var hexCode=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	return {
		generateNewGuid: function OSF_Outil_Guid$generateNewGuid() {
			var result="";
			var tick=(new Date()).getTime();
			var index=0;
			for (; index < 32 && tick > 0; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[tick % 16];
				tick=Math.floor(tick / 16);
			}
			for (; index < 32; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[Math.floor(Math.random() * 16)];
			}
			return result;
		}
	};
})();
window.OSF=OSF;
OSF.OUtil.setNamespace("OSF", window);
OSF.AppName={
	Unsupported: 0,
	Excel: 1,
	Word: 2,
	PowerPoint: 4,
	Outlook: 8,
	ExcelWebApp: 16,
	WordWebApp: 32,
	OutlookWebApp: 64,
	Project: 128,
	AccessWebApp: 256,
	PowerpointWebApp: 512,
	ExcelIOS: 1024,
	Sway: 2048,
	WordIOS: 4096,
	PowerPointIOS: 8192,
	Access: 16384,
	Lync: 32768,
	OutlookIOS: 65536,
	OneNoteWebApp: 131072,
	OneNote: 262144,
	ExcelWinRT: 524288,
	WordWinRT: 1048576,
	PowerpointWinRT: 2097152,
	OutlookAndroid: 4194304,
	OneNoteWinRT: 8388608,
	ExcelAndroid: 8388609,
	VisioWebApp: 8388610
};
OSF.InternalPerfMarker={
	DataCoercionBegin: "Agave.HostCall.CoerceDataStart",
	DataCoercionEnd: "Agave.HostCall.CoerceDataEnd"
};
OSF.HostCallPerfMarker={
	IssueCall: "Agave.HostCall.IssueCall",
	ReceiveResponse: "Agave.HostCall.ReceiveResponse",
	RuntimeExceptionRaised: "Agave.HostCall.RuntimeExecptionRaised"
};
OSF.AgaveHostAction={
	"Select": 0,
	"UnSelect": 1,
	"CancelDialog": 2,
	"InsertAgave": 3,
	"CtrlF6In": 4,
	"CtrlF6Exit": 5,
	"CtrlF6ExitShift": 6,
	"SelectWithError": 7,
	"NotifyHostError": 8,
	"RefreshAddinCommands": 9,
	"PageIsReady": 10,
	"TabIn": 11,
	"TabInShift": 12,
	"TabExit": 13,
	"TabExitShift": 14,
	"EscExit": 15,
	"F2Exit": 16,
	"ExitNoFocusable": 17,
	"ExitNoFocusableShift": 18
};
OSF.SharedConstants={
	"NotificationConversationIdSuffix": '_ntf'
};
OSF.DialogMessageType={
	DialogMessageReceived: 0,
	DialogParentMessageReceived: 1,
	DialogClosed: 12006
};
OSF.OfficeAppContext=function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix, hostCustomMessage, hostFullVersion, clientWindowHeight, clientWindowWidth, addinName, appDomains, dialogRequirementMatrix) {
	this._id=id;
	this._appName=appName;
	this._appVersion=appVersion;
	this._appUILocale=appUILocale;
	this._dataLocale=dataLocale;
	this._docUrl=docUrl;
	this._clientMode=clientMode;
	this._settings=settings;
	this._reason=reason;
	this._osfControlType=osfControlType;
	this._eToken=eToken;
	this._correlationId=correlationId;
	this._appInstanceId=appInstanceId;
	this._touchEnabled=touchEnabled;
	this._commerceAllowed=commerceAllowed;
	this._appMinorVersion=appMinorVersion;
	this._requirementMatrix=requirementMatrix;
	this._hostCustomMessage=hostCustomMessage;
	this._hostFullVersion=hostFullVersion;
	this._isDialog=false;
	this._clientWindowHeight=clientWindowHeight;
	this._clientWindowWidth=clientWindowWidth;
	this._addinName=addinName;
	this._appDomains=appDomains;
	this._dialogRequirementMatrix=dialogRequirementMatrix;
	this.get_id=function get_id() { return this._id; };
	this.get_appName=function get_appName() { return this._appName; };
	this.get_appVersion=function get_appVersion() { return this._appVersion; };
	this.get_appUILocale=function get_appUILocale() { return this._appUILocale; };
	this.get_dataLocale=function get_dataLocale() { return this._dataLocale; };
	this.get_docUrl=function get_docUrl() { return this._docUrl; };
	this.get_clientMode=function get_clientMode() { return this._clientMode; };
	this.get_bindings=function get_bindings() { return this._bindings; };
	this.get_settings=function get_settings() { return this._settings; };
	this.get_reason=function get_reason() { return this._reason; };
	this.get_osfControlType=function get_osfControlType() { return this._osfControlType; };
	this.get_eToken=function get_eToken() { return this._eToken; };
	this.get_correlationId=function get_correlationId() { return this._correlationId; };
	this.get_appInstanceId=function get_appInstanceId() { return this._appInstanceId; };
	this.get_touchEnabled=function get_touchEnabled() { return this._touchEnabled; };
	this.get_commerceAllowed=function get_commerceAllowed() { return this._commerceAllowed; };
	this.get_appMinorVersion=function get_appMinorVersion() { return this._appMinorVersion; };
	this.get_requirementMatrix=function get_requirementMatrix() { return this._requirementMatrix; };
	this.get_dialogRequirementMatrix=function get_dialogRequirementMatrix() { return this._dialogRequirementMatrix; };
	this.get_hostCustomMessage=function get_hostCustomMessage() { return this._hostCustomMessage; };
	this.get_hostFullVersion=function get_hostFullVersion() { return this._hostFullVersion; };
	this.get_isDialog=function get_isDialog() { return this._isDialog; };
	this.get_clientWindowHeight=function get_clientWindowHeight() { return this._clientWindowHeight; };
	this.get_clientWindowWidth=function get_clientWindowWidth() { return this._clientWindowWidth; };
	this.get_addinName=function get_addinName() { return this._addinName; };
	this.get_appDomains=function get_appDomains() { return this._appDomains; };
};
OSF.OsfControlType={
	DocumentLevel: 0,
	ContainerLevel: 1
};
OSF.ClientMode={
	ReadOnly: 0,
	ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Client", Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension", Microsoft.Office);
Microsoft.Office.WebExtension.InitializationReason={
	Inserted: "inserted",
	DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ValueFormat={
	Unformatted: "unformatted",
	Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType={
	All: "all"
};
Microsoft.Office.WebExtension.PlatformType={
	PC: "PC",
	OfficeOnline: "OfficeOnline",
	Mac: "Mac",
	iOS: "iOS",
	Android: "Android",
	Universal: "Universal"
};
Microsoft.Office.WebExtension.HostType={
	Word: "Word",
	Excel: "Excel",
	PowerPoint: "PowerPoint",
	Outlook: "Outlook",
	OneNote: "OneNote",
	Project: "Project",
	Access: "Access"
};
Microsoft.Office.WebExtension.Parameters={
	BindingType: "bindingType",
	CoercionType: "coercionType",
	ValueFormat: "valueFormat",
	FilterType: "filterType",
	Columns: "columns",
	SampleData: "sampleData",
	GoToType: "goToType",
	SelectionMode: "selectionMode",
	Id: "id",
	PromptText: "promptText",
	ItemName: "itemName",
	FailOnCollision: "failOnCollision",
	StartRow: "startRow",
	StartColumn: "startColumn",
	RowCount: "rowCount",
	ColumnCount: "columnCount",
	Callback: "callback",
	AsyncContext: "asyncContext",
	Data: "data",
	Rows: "rows",
	OverwriteIfStale: "overwriteIfStale",
	FileType: "fileType",
	EventType: "eventType",
	Handler: "handler",
	SliceSize: "sliceSize",
	SliceIndex: "sliceIndex",
	ActiveView: "activeView",
	Status: "status",
	PlatformType: "platformType",
	HostType: "hostType",
	ForceConsent: "forceConsent",
	ForceAddAccount: "forceAddAccount",
	Xml: "xml",
	Namespace: "namespace",
	Prefix: "prefix",
	XPath: "xPath",
	Text: "text",
	ImageLeft: "imageLeft",
	ImageTop: "imageTop",
	ImageWidth: "imageWidth",
	ImageHeight: "imageHeight",
	TaskId: "taskId",
	FieldId: "fieldId",
	FieldValue: "fieldValue",
	ServerUrl: "serverUrl",
	ListName: "listName",
	ResourceId: "resourceId",
	ViewType: "viewType",
	ViewName: "viewName",
	GetRawValue: "getRawValue",
	CellFormat: "cellFormat",
	TableOptions: "tableOptions",
	TaskIndex: "taskIndex",
	ResourceIndex: "resourceIndex",
	CustomFieldId: "customFieldId",
	Url: "url",
	MessageHandler: "messageHandler",
	Width: "width",
	Height: "height",
	RequireHTTPs: "requireHTTPS",
	MessageToParent: "messageToParent",
	DisplayInIframe: "displayInIframe",
	MessageContent: "messageContent",
	HideTitle: "hideTitle",
	AppCommandInvocationCompletedData: "appCommandInvocationCompletedData"
};
OSF.OUtil.setNamespace("DDA", OSF);
OSF.DDA.DocumentMode={
	ReadOnly: 1,
	ReadWrite: 0
};
OSF.DDA.PropertyDescriptors={
	AsyncResultStatus: "AsyncResultStatus"
};
OSF.DDA.EventDescriptors={};
OSF.DDA.ListDescriptors={};
OSF.DDA.UI={};
OSF.DDA.getXdmEventName=function OSF_DDA$GetXdmEventName(id, eventType) {
	if (eventType==Microsoft.Office.WebExtension.EventType.BindingSelectionChanged ||
		eventType==Microsoft.Office.WebExtension.EventType.BindingDataChanged ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeDeleted ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeInserted ||
		eventType==Microsoft.Office.WebExtension.EventType.DataNodeReplaced) {
		return id+"_"+eventType;
	}
	else {
		return eventType;
	}
};
OSF.DDA.MethodDispId={
	dispidMethodMin: 64,
	dispidGetSelectedDataMethod: 64,
	dispidSetSelectedDataMethod: 65,
	dispidAddBindingFromSelectionMethod: 66,
	dispidAddBindingFromPromptMethod: 67,
	dispidGetBindingMethod: 68,
	dispidReleaseBindingMethod: 69,
	dispidGetBindingDataMethod: 70,
	dispidSetBindingDataMethod: 71,
	dispidAddRowsMethod: 72,
	dispidClearAllRowsMethod: 73,
	dispidGetAllBindingsMethod: 74,
	dispidLoadSettingsMethod: 75,
	dispidSaveSettingsMethod: 76,
	dispidGetDocumentCopyMethod: 77,
	dispidAddBindingFromNamedItemMethod: 78,
	dispidAddColumnsMethod: 79,
	dispidGetDocumentCopyChunkMethod: 80,
	dispidReleaseDocumentCopyMethod: 81,
	dispidNavigateToMethod: 82,
	dispidGetActiveViewMethod: 83,
	dispidGetDocumentThemeMethod: 84,
	dispidGetOfficeThemeMethod: 85,
	dispidGetFilePropertiesMethod: 86,
	dispidClearFormatsMethod: 87,
	dispidSetTableOptionsMethod: 88,
	dispidSetFormatsMethod: 89,
	dispidExecuteRichApiRequestMethod: 93,
	dispidAppCommandInvocationCompletedMethod: 94,
	dispidCloseContainerMethod: 97,
	dispidGetAccessTokenMethod: 98,
	dispidGetSelectedTaskMethod: 110,
	dispidGetSelectedResourceMethod: 111,
	dispidGetTaskMethod: 112,
	dispidGetResourceFieldMethod: 113,
	dispidGetWSSUrlMethod: 114,
	dispidGetTaskFieldMethod: 115,
	dispidGetProjectFieldMethod: 116,
	dispidGetSelectedViewMethod: 117,
	dispidGetTaskByIndexMethod: 118,
	dispidGetResourceByIndexMethod: 119,
	dispidSetTaskFieldMethod: 120,
	dispidSetResourceFieldMethod: 121,
	dispidGetMaxTaskIndexMethod: 122,
	dispidGetMaxResourceIndexMethod: 123,
	dispidCreateTaskMethod: 124,
	dispidAddDataPartMethod: 128,
	dispidGetDataPartByIdMethod: 129,
	dispidGetDataPartsByNamespaceMethod: 130,
	dispidGetDataPartXmlMethod: 131,
	dispidGetDataPartNodesMethod: 132,
	dispidDeleteDataPartMethod: 133,
	dispidGetDataNodeValueMethod: 134,
	dispidGetDataNodeXmlMethod: 135,
	dispidGetDataNodesMethod: 136,
	dispidSetDataNodeValueMethod: 137,
	dispidSetDataNodeXmlMethod: 138,
	dispidAddDataNamespaceMethod: 139,
	dispidGetDataUriByPrefixMethod: 140,
	dispidGetDataPrefixByUriMethod: 141,
	dispidGetDataNodeTextMethod: 142,
	dispidSetDataNodeTextMethod: 143,
	dispidMessageParentMethod: 144,
	dispidSendMessageMethod: 145,
	dispidMethodMax: 145
};
OSF.DDA.EventDispId={
	dispidEventMin: 0,
	dispidInitializeEvent: 0,
	dispidSettingsChangedEvent: 1,
	dispidDocumentSelectionChangedEvent: 2,
	dispidBindingSelectionChangedEvent: 3,
	dispidBindingDataChangedEvent: 4,
	dispidDocumentOpenEvent: 5,
	dispidDocumentCloseEvent: 6,
	dispidActiveViewChangedEvent: 7,
	dispidDocumentThemeChangedEvent: 8,
	dispidOfficeThemeChangedEvent: 9,
	dispidDialogMessageReceivedEvent: 10,
	dispidDialogNotificationShownInAddinEvent: 11,
	dispidDialogParentMessageReceivedEvent: 12,
	dispidObjectDeletedEvent: 13,
	dispidObjectSelectionChangedEvent: 14,
	dispidObjectDataChangedEvent: 15,
	dispidContentControlAddedEvent: 16,
	dispidActivationStatusChangedEvent: 32,
	dispidAppCommandInvokedEvent: 39,
	dispidOlkItemSelectedChangedEvent: 46,
	dispidTaskSelectionChangedEvent: 56,
	dispidResourceSelectionChangedEvent: 57,
	dispidViewSelectionChangedEvent: 58,
	dispidDataNodeAddedEvent: 60,
	dispidDataNodeReplacedEvent: 61,
	dispidDataNodeDeletedEvent: 62,
	dispidEventMax: 63
};
OSF.DDA.ErrorCodeManager=(function () {
	var _errorMappings={};
	return {
		getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode) {
			var errorArgs=_errorMappings[errorCode];
			if (!errorArgs) {
				errorArgs=_errorMappings[this.errorCodes.ooeInternalError];
			}
			else {
				if (!errorArgs.name) {
					errorArgs.name=_errorMappings[this.errorCodes.ooeInternalError].name;
				}
				if (!errorArgs.message) {
					errorArgs.message=_errorMappings[this.errorCodes.ooeInternalError].message;
				}
			}
			return errorArgs;
		},
		addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage) {
			_errorMappings[errorCode]=errorNameMessage;
		},
		errorCodes: {
			ooeSuccess: 0,
			ooeChunkResult: 1,
			ooeCoercionTypeNotSupported: 1000,
			ooeGetSelectionNotMatchDataType: 1001,
			ooeCoercionTypeNotMatchBinding: 1002,
			ooeInvalidGetRowColumnCounts: 1003,
			ooeSelectionNotSupportCoercionType: 1004,
			ooeInvalidGetStartRowColumn: 1005,
			ooeNonUniformPartialGetNotSupported: 1006,
			ooeGetDataIsTooLarge: 1008,
			ooeFileTypeNotSupported: 1009,
			ooeGetDataParametersConflict: 1010,
			ooeInvalidGetColumns: 1011,
			ooeInvalidGetRows: 1012,
			ooeInvalidReadForBlankRow: 1013,
			ooeUnsupportedDataObject: 2000,
			ooeCannotWriteToSelection: 2001,
			ooeDataNotMatchSelection: 2002,
			ooeOverwriteWorksheetData: 2003,
			ooeDataNotMatchBindingSize: 2004,
			ooeInvalidSetStartRowColumn: 2005,
			ooeInvalidDataFormat: 2006,
			ooeDataNotMatchCoercionType: 2007,
			ooeDataNotMatchBindingType: 2008,
			ooeSetDataIsTooLarge: 2009,
			ooeNonUniformPartialSetNotSupported: 2010,
			ooeInvalidSetColumns: 2011,
			ooeInvalidSetRows: 2012,
			ooeSetDataParametersConflict: 2013,
			ooeCellDataAmountBeyondLimits: 2014,
			ooeSelectionCannotBound: 3000,
			ooeBindingNotExist: 3002,
			ooeBindingToMultipleSelection: 3003,
			ooeInvalidSelectionForBindingType: 3004,
			ooeOperationNotSupportedOnThisBindingType: 3005,
			ooeNamedItemNotFound: 3006,
			ooeMultipleNamedItemFound: 3007,
			ooeInvalidNamedItemForBindingType: 3008,
			ooeUnknownBindingType: 3009,
			ooeOperationNotSupportedOnMatrixData: 3010,
			ooeInvalidColumnsForBinding: 3011,
			ooeSettingNameNotExist: 4000,
			ooeSettingsCannotSave: 4001,
			ooeSettingsAreStale: 4002,
			ooeOperationNotSupported: 5000,
			ooeInternalError: 5001,
			ooeDocumentReadOnly: 5002,
			ooeEventHandlerNotExist: 5003,
			ooeInvalidApiCallInContext: 5004,
			ooeShuttingDown: 5005,
			ooeUnsupportedEnumeration: 5007,
			ooeIndexOutOfRange: 5008,
			ooeBrowserAPINotSupported: 5009,
			ooeInvalidParam: 5010,
			ooeRequestTimeout: 5011,
			ooeInvalidOrTimedOutSession: 5012,
			ooeInvalidApiArguments: 5013,
			ooeTooManyIncompleteRequests: 5100,
			ooeRequestTokenUnavailable: 5101,
			ooeActivityLimitReached: 5102,
			ooeCustomXmlNodeNotFound: 6000,
			ooeCustomXmlError: 6100,
			ooeCustomXmlExceedQuota: 6101,
			ooeCustomXmlOutOfDate: 6102,
			ooeNoCapability: 7000,
			ooeCannotNavTo: 7001,
			ooeSpecifiedIdNotExist: 7002,
			ooeNavOutOfBound: 7004,
			ooeElementMissing: 8000,
			ooeProtectedError: 8001,
			ooeInvalidCellsValue: 8010,
			ooeInvalidTableOptionValue: 8011,
			ooeInvalidFormatValue: 8012,
			ooeRowIndexOutOfRange: 8020,
			ooeColIndexOutOfRange: 8021,
			ooeFormatValueOutOfRange: 8022,
			ooeCellFormatAmountBeyondLimits: 8023,
			ooeMemoryFileLimit: 11000,
			ooeNetworkProblemRetrieveFile: 11001,
			ooeInvalidSliceSize: 11002,
			ooeInvalidCallback: 11101,
			ooeInvalidWidth: 12000,
			ooeInvalidHeight: 12001,
			ooeNavigationError: 12002,
			ooeInvalidScheme: 12003,
			ooeAppDomains: 12004,
			ooeRequireHTTPS: 12005,
			ooeWebDialogClosed: 12006,
			ooeDialogAlreadyOpened: 12007,
			ooeEndUserAllow: 12008,
			ooeEndUserIgnore: 12009,
			ooeNotUILessDialog: 12010,
			ooeCrossZone: 12011,
			ooeNotSSOAgave: 13000,
			ooeSSOUserNotSignedIn: 13001,
			ooeSSOUserAborted: 13002,
			ooeSSOUnsupportedUserIdentity: 13003,
			ooeSSOInvalidResourceUrl: 13004,
			ooeSSOInvalidGrant: 13005,
			ooeSSOClientError: 13006,
			ooeSSOServerError: 13007,
			ooeAddinIsAlreadyRequestingToken: 13008
		},
		initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS) {
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType]={ name: stringNS.L_DataReadError, message: stringNS.L_GetSelectionNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotMatchBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRowColumnCounts };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType]={ name: stringNS.L_DataReadError, message: stringNS.L_SelectionNotSupportCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_NonUniformPartialGetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_FileTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataParametersConflict]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetColumns]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRows]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidReadForBlankRow]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidReadForBlankRow };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject]={ name: stringNS.L_DataWriteError, message: stringNS.L_UnsupportedDataObject };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_CannotWriteToSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData]={ name: stringNS.L_DataWriteError, message: stringNS.L_OverwriteWorksheetData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchBindingSize };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat]={ name: stringNS.L_InvalidFormat, message: stringNS.L_InvalidDataFormat };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported]={ name: stringNS.L_DataWriteError, message: stringNS.L_NonUniformPartialSetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetColumns]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetColumns };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetRows]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetRows };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataParametersConflict]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataParametersConflict };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_SelectionCannotBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist]={ name: stringNS.L_InvalidBindingError, message: stringNS.L_BindingNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection]={ name: stringNS.L_BindingCreationError, message: stringNS.L_BindingToMultipleSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidSelectionForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnThisBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_NamedItemNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_MultipleNamedItemFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidNamedItemForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType]={ name: stringNS.L_InvalidBinding, message: stringNS.L_UnknownBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnMatrixData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidColumnsForBinding]={ name: stringNS.L_InvalidBinding, message: stringNS.L_InvalidColumnsForBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist]={ name: stringNS.L_ReadSettingsError, message: stringNS.L_SettingNameNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave]={ name: stringNS.L_SaveSettingsError, message: stringNS.L_SettingsCannotSave };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale]={ name: stringNS.L_SettingsStaleError, message: stringNS.L_SettingsAreStale };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported]={ name: stringNS.L_HostError, message: stringNS.L_OperationNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError]={ name: stringNS.L_InternalError, message: stringNS.L_InternalErrorDescription };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly]={ name: stringNS.L_PermissionDenied, message: stringNS.L_DocumentReadOnly };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist]={ name: stringNS.L_EventRegistrationError, message: stringNS.L_EventHandlerNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext]={ name: stringNS.L_InvalidAPICall, message: stringNS.L_InvalidApiCallInContext };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown]={ name: stringNS.L_ShuttingDown, message: stringNS.L_ShuttingDown };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration]={ name: stringNS.L_UnsupportedEnumeration, message: stringNS.L_UnsupportedEnumerationMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBrowserAPINotSupported]={ name: stringNS.L_APINotSupported, message: stringNS.L_BrowserAPINotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTimeout]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTimeout };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidOrTimedOutSession]={ name: stringNS.L_InvalidOrTimedOutSession, message: stringNS.L_InvalidOrTimedOutSessionMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeTooManyIncompleteRequests]={ name: stringNS.L_APICallFailed, message: stringNS.L_TooManyIncompleteRequests };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTokenUnavailable]={ name: stringNS.L_APICallFailed, message: stringNS.L_RequestTokenUnavailable };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeActivityLimitReached]={ name: stringNS.L_APICallFailed, message: stringNS.L_ActivityLimitReached };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiArguments]={ name: stringNS.L_APICallFailed, message: stringNS.L_InvalidApiArgumentsMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound]={ name: stringNS.L_InvalidNode, message: stringNS.L_CustomXmlNodeNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlExceedQuota]={ name: stringNS.L_CustomXmlExceedQuotaName, message: stringNS.L_CustomXmlExceedQuotaMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlOutOfDate]={ name: stringNS.L_CustomXmlOutOfDateName, message: stringNS.L_CustomXmlOutOfDateMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo]={ name: stringNS.L_CannotNavigateTo, message: stringNS.L_CannotNavigateTo };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist]={ name: stringNS.L_SpecifiedIdNotExist, message: stringNS.L_SpecifiedIdNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound]={ name: stringNS.L_NavOutOfBound, message: stringNS.L_NavOutOfBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellDataAmountBeyondLimits]={ name: stringNS.L_DataWriteReminder, message: stringNS.L_CellDataAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing]={ name: stringNS.L_MissingParameter, message: stringNS.L_ElementMissing };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidCellsValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidTableOptionValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidFormatValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_RowIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_ColIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_FormatValueOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellFormatAmountBeyondLimits]={ name: stringNS.L_FormattingReminder, message: stringNS.L_CellFormatAmountBeyondLimits };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMemoryFileLimit]={ name: stringNS.L_MemoryLimit, message: stringNS.L_CloseFileBeforeRetrieve };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNetworkProblemRetrieveFile]={ name: stringNS.L_NetworkProblem, message: stringNS.L_NetworkProblemRetrieveFile };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize]={ name: stringNS.L_InvalidValue, message: stringNS.L_SliceSizeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAlreadyOpened };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidWidth]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidHeight]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavigationError]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_NetworkProblem };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme]={ name: stringNS.L_DialogNavigateError, message: stringNS.L_DialogInvalidScheme };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAppDomains]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogRequireHTTPS };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_UserClickIgnore };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCrossZone]={ name: stringNS.L_DisplayDialogError, message: stringNS.L_NewWindowCrossZoneErrorString };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNotSSOAgave]={ name: stringNS.L_APINotSupported, message: stringNS.L_InvalidSSOAddinMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUserNotSignedIn]={ name: stringNS.L_UserNotSignedIn, message: stringNS.L_UserNotSignedIn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUserAborted]={ name: stringNS.L_UserAborted, message: stringNS.L_UserAbortedMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOUnsupportedUserIdentity]={ name: stringNS.L_UnsupportedUserIdentity, message: stringNS.L_UnsupportedUserIdentityMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOInvalidResourceUrl]={ name: stringNS.L_InvalidResourceUrl, message: stringNS.L_InvalidResourceUrlMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOInvalidGrant]={ name: stringNS.L_InvalidGrant, message: stringNS.L_InvalidGrantMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOClientError]={ name: stringNS.L_SSOClientError, message: stringNS.L_SSOClientErrorMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSSOServerError]={ name: stringNS.L_SSOServerError, message: stringNS.L_SSOServerErrorMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAddinIsAlreadyRequestingToken]={ name: stringNS.L_AddinIsAlreadyRequestingToken, message: stringNS.L_AddinIsAlreadyRequestingTokenMessage };
		}
	};
})();
var OfficeExt;
(function (OfficeExt) {
	var Requirement;
	(function (Requirement) {
		var RequirementVersion=(function () {
			function RequirementVersion() {
			}
			return RequirementVersion;
		})();
		Requirement.RequirementVersion=RequirementVersion;
		var RequirementMatrix=(function () {
			function RequirementMatrix(_setMap) {
				this.isSetSupported=function _isSetSupported(name, minVersion) {
					if (name==undefined) {
						return false;
					}
					if (minVersion==undefined) {
						minVersion=0;
					}
					var setSupportArray=this._setMap;
					var sets=setSupportArray._sets;
					if (sets.hasOwnProperty(name.toLowerCase())) {
						var setMaxVersion=sets[name.toLowerCase()];
						try {
							var setMaxVersionNum=this._getVersion(setMaxVersion);
							minVersion=minVersion+"";
							var minVersionNum=this._getVersion(minVersion);
							if (setMaxVersionNum.major > 0 && setMaxVersionNum.major > minVersionNum.major) {
								return true;
							}
							if (setMaxVersionNum.minor > 0 &&
								setMaxVersionNum.minor > 0 &&
								setMaxVersionNum.major==minVersionNum.major &&
								setMaxVersionNum.minor >=minVersionNum.minor) {
								return true;
							}
						}
						catch (e) {
							return false;
						}
					}
					return false;
				};
				this._getVersion=function (version) {
					var temp=version.split(".");
					var major=0;
					var minor=0;
					if (temp.length < 2 && isNaN(Number(version))) {
						throw "version format incorrect";
					}
					else {
						major=Number(temp[0]);
						if (temp.length >=2) {
							minor=Number(temp[1]);
						}
						if (isNaN(major) || isNaN(minor)) {
							throw "version format incorrect";
						}
					}
					var result={ "minor": minor, "major": major };
					return result;
				};
				this._setMap=_setMap;
				this.isSetSupported=this.isSetSupported.bind(this);
			}
			return RequirementMatrix;
		})();
		Requirement.RequirementMatrix=RequirementMatrix;
		var DefaultSetRequirement=(function () {
			function DefaultSetRequirement(setMap) {
				this._addSetMap=function DefaultSetRequirement_addSetMap(addedSet) {
					for (var name in addedSet) {
						this._sets[name]=addedSet[name];
					}
				};
				this._sets=setMap;
			}
			return DefaultSetRequirement;
		})();
		Requirement.DefaultSetRequirement=DefaultSetRequirement;
		var DefaultDialogSetRequirement=(function (_super) {
			__extends(DefaultDialogSetRequirement, _super);
			function DefaultDialogSetRequirement() {
				_super.call(this, {
					"dialogapi": 1.1
				});
			}
			return DefaultDialogSetRequirement;
		})(DefaultSetRequirement);
		Requirement.DefaultDialogSetRequirement=DefaultDialogSetRequirement;
		var ExcelClientDefaultSetRequirement=(function (_super) {
			__extends(ExcelClientDefaultSetRequirement, _super);
			function ExcelClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"excelapi": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelClientDefaultSetRequirement=ExcelClientDefaultSetRequirement;
		var ExcelClientV1DefaultSetRequirement=(function (_super) {
			__extends(ExcelClientV1DefaultSetRequirement, _super);
			function ExcelClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return ExcelClientV1DefaultSetRequirement;
		})(ExcelClientDefaultSetRequirement);
		Requirement.ExcelClientV1DefaultSetRequirement=ExcelClientV1DefaultSetRequirement;
		var OutlookClientDefaultSetRequirement=(function (_super) {
			__extends(OutlookClientDefaultSetRequirement, _super);
			function OutlookClientDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientDefaultSetRequirement=OutlookClientDefaultSetRequirement;
		var WordClientDefaultSetRequirement=(function (_super) {
			__extends(WordClientDefaultSetRequirement, _super);
			function WordClientDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1,
					"wordapi": 1.1
				});
			}
			return WordClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordClientDefaultSetRequirement=WordClientDefaultSetRequirement;
		var WordClientV1DefaultSetRequirement=(function (_super) {
			__extends(WordClientV1DefaultSetRequirement, _super);
			function WordClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2,
					"imagecoercion": 1.1
				});
			}
			return WordClientV1DefaultSetRequirement;
		})(WordClientDefaultSetRequirement);
		Requirement.WordClientV1DefaultSetRequirement=WordClientV1DefaultSetRequirement;
		var PowerpointClientDefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientDefaultSetRequirement, _super);
			function PowerpointClientDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointClientDefaultSetRequirement=PowerpointClientDefaultSetRequirement;
		var PowerpointClientV1DefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientV1DefaultSetRequirement, _super);
			function PowerpointClientV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return PowerpointClientV1DefaultSetRequirement;
		})(PowerpointClientDefaultSetRequirement);
		Requirement.PowerpointClientV1DefaultSetRequirement=PowerpointClientV1DefaultSetRequirement;
		var ProjectClientDefaultSetRequirement=(function (_super) {
			__extends(ProjectClientDefaultSetRequirement, _super);
			function ProjectClientDefaultSetRequirement() {
				_super.call(this, {
					"selection": 1.1,
					"textcoercion": 1.1
				});
			}
			return ProjectClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ProjectClientDefaultSetRequirement=ProjectClientDefaultSetRequirement;
		var ExcelWebDefaultSetRequirement=(function (_super) {
			__extends(ExcelWebDefaultSetRequirement, _super);
			function ExcelWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"file": 1.1
				});
			}
			return ExcelWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelWebDefaultSetRequirement=ExcelWebDefaultSetRequirement;
		var WordWebDefaultSetRequirement=(function (_super) {
			__extends(WordWebDefaultSetRequirement, _super);
			function WordWebDefaultSetRequirement() {
				_super.call(this, {
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"imagecoercion": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablecoercion": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordWebDefaultSetRequirement=WordWebDefaultSetRequirement;
		var PowerpointWebDefaultSetRequirement=(function (_super) {
			__extends(PowerpointWebDefaultSetRequirement, _super);
			function PowerpointWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"settings": 1.1
				});
			}
			return PowerpointWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointWebDefaultSetRequirement=PowerpointWebDefaultSetRequirement;
		var OutlookWebDefaultSetRequirement=(function (_super) {
			__extends(OutlookWebDefaultSetRequirement, _super);
			function OutlookWebDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookWebDefaultSetRequirement=OutlookWebDefaultSetRequirement;
		var SwayWebDefaultSetRequirement=(function (_super) {
			__extends(SwayWebDefaultSetRequirement, _super);
			function SwayWebDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"documentevents": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return SwayWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.SwayWebDefaultSetRequirement=SwayWebDefaultSetRequirement;
		var AccessWebDefaultSetRequirement=(function (_super) {
			__extends(AccessWebDefaultSetRequirement, _super);
			function AccessWebDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"partialtablebindings": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1
				});
			}
			return AccessWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.AccessWebDefaultSetRequirement=AccessWebDefaultSetRequirement;
		var ExcelIOSDefaultSetRequirement=(function (_super) {
			__extends(ExcelIOSDefaultSetRequirement, _super);
			function ExcelIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"documentevents": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1
				});
			}
			return ExcelIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelIOSDefaultSetRequirement=ExcelIOSDefaultSetRequirement;
		var WordIOSDefaultSetRequirement=(function (_super) {
			__extends(WordIOSDefaultSetRequirement, _super);
			function WordIOSDefaultSetRequirement() {
				_super.call(this, {
					"bindingevents": 1.1,
					"compressedfile": 1.1,
					"customxmlparts": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"htmlcoercion": 1.1,
					"matrixbindings": 1.1,
					"matrixcoercion": 1.1,
					"ooxmlcoercion": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordIOSDefaultSetRequirement=WordIOSDefaultSetRequirement;
		var WordIOSV1DefaultSetRequirement=(function (_super) {
			__extends(WordIOSV1DefaultSetRequirement, _super);
			function WordIOSV1DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"customxmlparts": 1.2,
					"wordapi": 1.2
				});
			}
			return WordIOSV1DefaultSetRequirement;
		})(WordIOSDefaultSetRequirement);
		Requirement.WordIOSV1DefaultSetRequirement=WordIOSV1DefaultSetRequirement;
		var PowerpointIOSDefaultSetRequirement=(function (_super) {
			__extends(PowerpointIOSDefaultSetRequirement, _super);
			function PowerpointIOSDefaultSetRequirement() {
				_super.call(this, {
					"activeview": 1.1,
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"pdffile": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointIOSDefaultSetRequirement=PowerpointIOSDefaultSetRequirement;
		var OutlookIOSDefaultSetRequirement=(function (_super) {
			__extends(OutlookIOSDefaultSetRequirement, _super);
			function OutlookIOSDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookIOSDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookIOSDefaultSetRequirement=OutlookIOSDefaultSetRequirement;
		var RequirementsMatrixFactory=(function () {
			function RequirementsMatrixFactory() {
			}
			RequirementsMatrixFactory.initializeOsfDda=function () {
				OSF.OUtil.setNamespace("Requirement", OSF.DDA);
			};
			RequirementsMatrixFactory.getDefaultRequirementMatrix=function (appContext) {
				this.initializeDefaultSetMatrix();
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_requirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				}
				else {
					var appLocator=RequirementsMatrixFactory.getClientFullVersionString(appContext);
					if (RequirementsMatrixFactory.DefaultSetArrayMatrix !=undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] !=undefined) {
						defaultRequirementMatrix=new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
					}
					else {
						defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement({}));
					}
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.getDefaultDialogRequirementMatrix=function (appContext) {
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_dialogRequirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				}
				else {
					defaultRequirementMatrix=new RequirementMatrix(new DefaultDialogSetRequirement());
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.getClientFullVersionString=function (appContext) {
				var appMinorVersion=appContext.get_appMinorVersion();
				var appMinorVersionString="";
				var appFullVersion="";
				var appName=appContext.get_appName();
				var isIOSClient=appName==1024 ||
					appName==4096 ||
					appName==8192 ||
					appName==65536;
				if (isIOSClient && appContext.get_appVersion()==1) {
					if (appName==4096 && appMinorVersion >=15) {
						appFullVersion="16.00.01";
					}
					else {
						appFullVersion="16.00";
					}
				}
				else if (appContext.get_appName()==64) {
					appFullVersion=appContext.get_appVersion();
				}
				else {
					if (appMinorVersion < 10) {
						appMinorVersionString="0"+appMinorVersion;
					}
					else {
						appMinorVersionString=""+appMinorVersion;
					}
					appFullVersion=appContext.get_appVersion()+"."+appMinorVersionString;
				}
				return appContext.get_appName()+"-"+appFullVersion;
			};
			RequirementsMatrixFactory.initializeDefaultSetMatrix=function () {
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1600]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1600]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1600]=new PowerpointClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1601]=new ExcelClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1601]=new WordClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1601]=new PowerpointClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1600]=new OutlookClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1600]=new ExcelWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_WAC_1600]=new WordWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1600]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1601]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1600]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Access_WAC_1600]=new AccessWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_WAC_1600]=new PowerpointWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1600]=new ExcelIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.SWAY_WAC_1600]=new SwayWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1600]=new WordIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_16001]=new WordIOSV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1600]=new PowerpointIOSDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_IOS_1600]=new OutlookIOSDefaultSetRequirement();
			};
			RequirementsMatrixFactory.Excel_RCLIENT_1600="1-16.00";
			RequirementsMatrixFactory.Excel_RCLIENT_1601="1-16.01";
			RequirementsMatrixFactory.Word_RCLIENT_1600="2-16.00";
			RequirementsMatrixFactory.Word_RCLIENT_1601="2-16.01";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1600="4-16.00";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1601="4-16.01";
			RequirementsMatrixFactory.Outlook_RCLIENT_1600="8-16.00";
			RequirementsMatrixFactory.Excel_WAC_1600="16-16.00";
			RequirementsMatrixFactory.Word_WAC_1600="32-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1600="64-16.00";
			RequirementsMatrixFactory.Outlook_WAC_1601="64-16.01";
			RequirementsMatrixFactory.Project_RCLIENT_1600="128-16.00";
			RequirementsMatrixFactory.Access_WAC_1600="256-16.00";
			RequirementsMatrixFactory.PowerPoint_WAC_1600="512-16.00";
			RequirementsMatrixFactory.Excel_IOS_1600="1024-16.00";
			RequirementsMatrixFactory.SWAY_WAC_1600="2048-16.00";
			RequirementsMatrixFactory.Word_IOS_1600="4096-16.00";
			RequirementsMatrixFactory.Word_IOS_16001="4096-16.00.01";
			RequirementsMatrixFactory.PowerPoint_IOS_1600="8192-16.00";
			RequirementsMatrixFactory.Outlook_IOS_1600="65536-16.00";
			RequirementsMatrixFactory.DefaultSetArrayMatrix={};
			return RequirementsMatrixFactory;
		})();
		Requirement.RequirementsMatrixFactory=RequirementsMatrixFactory;
	})(Requirement=OfficeExt.Requirement || (OfficeExt.Requirement={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
var OfficeExt;
(function (OfficeExt) {
	var HostName;
	(function (HostName) {
		var Host=(function () {
			function Host() {
				this.getDiagnostics=function _getDiagnostics(version) {
					var diagnostics={
						host: this.getHost(),
						version: (version || this.getDefaultVersion()),
						platform: this.getPlatform()
					};
					return diagnostics;
				};
				this.platformRemappings={
					web: Microsoft.Office.WebExtension.PlatformType.OfficeOnline,
					winrt: Microsoft.Office.WebExtension.PlatformType.Universal,
					win32: Microsoft.Office.WebExtension.PlatformType.PC,
					mac: Microsoft.Office.WebExtension.PlatformType.Mac,
					ios: Microsoft.Office.WebExtension.PlatformType.iOS,
					android: Microsoft.Office.WebExtension.PlatformType.Android
				};
				this.camelCaseMappings={
					powerpoint: Microsoft.Office.WebExtension.HostType.PowerPoint,
					onenote: Microsoft.Office.WebExtension.HostType.OneNote
				};
				this.hostInfo=OSF._OfficeAppFactory.getHostInfo();
				this.getHost=this.getHost.bind(this);
				this.getPlatform=this.getPlatform.bind(this);
				this.getDiagnostics=this.getDiagnostics.bind(this);
			}
			Host.prototype.capitalizeFirstLetter=function (input) {
				if (input) {
					return (input[0].toUpperCase()+input.slice(1).toLowerCase());
				}
				return input;
			};
			Host.getInstance=function () {
				if (Host.hostObj===undefined) {
					Host.hostObj=new Host();
				}
				return Host.hostObj;
			};
			Host.prototype.getPlatform=function () {
				if (this.hostInfo.hostPlatform) {
					var hostPlatform=this.hostInfo.hostPlatform.toLowerCase();
					if (this.platformRemappings[hostPlatform]) {
						return this.platformRemappings[hostPlatform];
					}
				}
				return null;
			};
			Host.prototype.getHost=function () {
				if (this.hostInfo.hostType) {
					var hostType=this.hostInfo.hostType.toLowerCase();
					if (this.camelCaseMappings[hostType]) {
						return this.camelCaseMappings[hostType];
					}
					hostType=this.capitalizeFirstLetter(this.hostInfo.hostType);
					if (Microsoft.Office.WebExtension.HostType[hostType]) {
						return Microsoft.Office.WebExtension.HostType[hostType];
					}
				}
				return null;
			};
			Host.prototype.getDefaultVersion=function () {
				if (this.getHost()) {
					return "16.0.0000.0000";
				}
				return null;
			};
			return Host;
		})();
		HostName.Host=Host;
	})(HostName=OfficeExt.HostName || (OfficeExt.HostName={}));
})(OfficeExt || (OfficeExt={}));
Microsoft.Office.WebExtension.ApplicationMode={
	WebEditor: "webEditor",
	WebViewer: "webViewer",
	Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode={
	ReadOnly: "readOnly",
	ReadWrite: "readWrite"
};
OSF.NamespaceManager=(function OSF_NamespaceManager() {
	var _userOffice;
	var _useShortcut=false;
	return {
		enableShortcut: function OSF_NamespaceManager$enableShortcut() {
			if (!_useShortcut) {
				if (window.Office) {
					_userOffice=window.Office;
				}
				else {
					OSF.OUtil.setNamespace("Office", window);
				}
				window.Office=Microsoft.Office.WebExtension;
				_useShortcut=true;
			}
		},
		disableShortcut: function OSF_NamespaceManager$disableShortcut() {
			if (_useShortcut) {
				if (_userOffice) {
					window.Office=_userOffice;
				}
				else {
					OSF.OUtil.unsetNamespace("Office", window);
				}
				_useShortcut=false;
			}
		}
	};
})();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.useShortNamespace=function Microsoft_Office_WebExtension_useShortNamespace(useShortcut) {
	if (useShortcut) {
		OSF.NamespaceManager.enableShortcut();
	}
	else {
		OSF.NamespaceManager.disableShortcut();
	}
};
Microsoft.Office.WebExtension.select=function Microsoft_Office_WebExtension_select(str, errorCallback) {
	var promise;
	if (str && typeof str=="string") {
		var index=str.indexOf("#");
		if (index !=-1) {
			var op=str.substring(0, index);
			var target=str.substring(index+1);
			switch (op) {
				case "binding":
				case "bindings":
					if (target) {
						promise=new OSF.DDA.BindingPromise(target);
					}
					break;
			}
		}
	}
	if (!promise) {
		if (errorCallback) {
			var callbackType=typeof errorCallback;
			if (callbackType=="function") {
				var callArgs={};
				callArgs[Microsoft.Office.WebExtension.Parameters.Callback]=errorCallback;
				OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext, OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext));
			}
			else {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, callbackType);
			}
		}
	}
	else {
		promise.onFail=errorCallback;
		return promise;
	}
};
OSF.DDA.Context=function OSF_DDA_Context(officeAppContext, document, license, appOM, getOfficeTheme) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"contentLanguage": {
			value: officeAppContext.get_dataLocale()
		},
		"displayLanguage": {
			value: officeAppContext.get_appUILocale()
		},
		"touchEnabled": {
			value: officeAppContext.get_touchEnabled()
		},
		"commerceAllowed": {
			value: officeAppContext.get_commerceAllowed()
		},
		"host": {
			value: OfficeExt.HostName.Host.getInstance().getHost()
		},
		"platform": {
			value: OfficeExt.HostName.Host.getInstance().getPlatform()
		},
		"diagnostics": {
			value: OfficeExt.HostName.Host.getInstance().getDiagnostics(officeAppContext.get_hostFullVersion())
		}
	});
	if (license) {
		OSF.OUtil.defineEnumerableProperty(this, "license", {
			value: license
		});
	}
	if (officeAppContext.ui) {
		OSF.OUtil.defineEnumerableProperty(this, "ui", {
			value: officeAppContext.ui
		});
	}
	if (officeAppContext.auth) {
		OSF.OUtil.defineEnumerableProperty(this, "auth", {
			value: officeAppContext.auth
		});
	}
	if (officeAppContext.get_isDialog()) {
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultDialogRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this, "requirements", {
			value: requirements
		});
	}
	else {
		if (document) {
			OSF.OUtil.defineEnumerableProperty(this, "document", {
				value: document
			});
		}
		if (appOM) {
			var displayName=appOM.displayName || "appOM";
			delete appOM.displayName;
			OSF.OUtil.defineEnumerableProperty(this, displayName, {
				value: appOM
			});
		}
		if (getOfficeTheme) {
			OSF.OUtil.defineEnumerableProperty(this, "officeTheme", {
				get: function () {
					return getOfficeTheme();
				}
			});
		}
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this, "requirements", {
			value: requirements
		});
	}
};
OSF.DDA.OutlookContext=function OSF_DDA_OutlookContext(appContext, settings, license, appOM, getOfficeTheme) {
	OSF.DDA.OutlookContext.uber.constructor.call(this, appContext, null, license, appOM, getOfficeTheme);
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "roamingSettings", {
			value: settings
		});
	}
};
OSF.OUtil.extend(OSF.DDA.OutlookContext, OSF.DDA.Context);
OSF.DDA.OutlookAppOm=function OSF_DDA_OutlookAppOm(appContext, window, appReady) { };
OSF.DDA.Document=function OSF_DDA_Document(officeAppContext, settings) {
	var mode;
	switch (officeAppContext.get_clientMode()) {
		case OSF.ClientMode.ReadOnly:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadOnly;
			break;
		case OSF.ClientMode.ReadWrite:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadWrite;
			break;
	}
	;
	if (settings) {
		OSF.OUtil.defineEnumerableProperty(this, "settings", {
			value: settings
		});
	}
	;
	OSF.OUtil.defineMutableProperties(this, {
		"mode": {
			value: mode
		},
		"url": {
			value: officeAppContext.get_docUrl()
		}
	});
};
OSF.DDA.JsomDocument=function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings) {
	OSF.DDA.JsomDocument.uber.constructor.call(this, officeAppContext, settings);
	if (bindingFacade) {
		OSF.OUtil.defineEnumerableProperty(this, "bindings", {
			get: function OSF_DDA_Document$GetBindings() { return bindingFacade; }
		});
	}
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetSelectedDataAsync,
		am.SetSelectedDataAsync
	]);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
};
OSF.OUtil.extend(OSF.DDA.JsomDocument, OSF.DDA.Document);
OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension, "context", {
	get: function Microsoft_Office_WebExtension$GetContext() {
		var context;
		if (OSF && OSF._OfficeAppFactory) {
			context=OSF._OfficeAppFactory.getContext();
		}
		return context;
	}
});
OSF.DDA.License=function OSF_DDA_License(eToken) {
	OSF.OUtil.defineEnumerableProperty(this, "value", {
		value: eToken
	});
};
OSF.DDA.ApiMethodCall=function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var getInvalidParameterString=OSF.OUtil.delayExecutionAndCache(function () {
		return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters, displayName);
	});
	this.verifyArguments=function OSF_DDA_ApiMethodCall$VerifyArguments(params, args) {
		for (var name in params) {
			var param=params[name];
			var arg=args[name];
			if (param["enum"]) {
				switch (typeof arg) {
					case "string":
						if (OSF.OUtil.listContainsValue(param["enum"], arg)) {
							break;
						}
					case "undefined":
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration;
					default:
						throw getInvalidParameterString();
				}
			}
			if (param["types"]) {
				if (!OSF.OUtil.listContainsValue(param["types"], typeof arg)) {
					throw getInvalidParameterString();
				}
			}
		}
	};
	this.extractRequiredArguments=function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo) {
		if (userArgs.length < requiredCount) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
		}
		var requiredArgs=[];
		var index;
		for (index=0; index < requiredCount; index++) {
			requiredArgs.push(userArgs[index]);
		}
		this.verifyArguments(requiredParameters, requiredArgs);
		var ret={};
		for (index=0; index < requiredCount; index++) {
			var param=requiredParameters[index];
			var arg=requiredArgs[index];
			if (param.verify) {
				var isValid=param.verify(arg, caller, stateInfo);
				if (!isValid) {
					throw getInvalidParameterString();
				}
			}
			ret[param.name]=arg;
		}
		return ret;
	},
		this.fillOptions=function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo) {
			options=options || {};
			for (var optionName in supportedOptions) {
				if (!OSF.OUtil.listContainsKey(options, optionName)) {
					var value=undefined;
					var option=supportedOptions[optionName];
					if (option.calculate && requiredArgs) {
						value=option.calculate(requiredArgs, caller, stateInfo);
					}
					if (!value && option.defaultValue !==undefined) {
						value=option.defaultValue;
					}
					options[optionName]=value;
				}
			}
			return options;
		};
	this.constructCallArgs=function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo) {
		var callArgs={};
		for (var r in required) {
			callArgs[r]=required[r];
		}
		for (var o in options) {
			callArgs[o]=options[o];
		}
		for (var s in privateStateCallbacks) {
			callArgs[s]=privateStateCallbacks[s](caller, stateInfo);
		}
		if (checkCallArgs) {
			callArgs=checkCallArgs(callArgs, caller, stateInfo);
		}
		return callArgs;
	};
};
OSF.OUtil.setNamespace("AsyncResultEnum", OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties={
	Context: "Context",
	Value: "Value",
	Status: "Status",
	Error: "Error"
};
Microsoft.Office.WebExtension.AsyncResultStatus={
	Succeeded: "succeeded",
	Failed: "failed"
};
OSF.DDA.AsyncResultEnum.ErrorCode={
	Success: 0,
	Failed: 1
};
OSF.DDA.AsyncResultEnum.ErrorProperties={
	Name: "Name",
	Message: "Message",
	Code: "Code"
};
OSF.DDA.AsyncMethodNames={};
OSF.DDA.AsyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.AsyncMethodNames[entry]=am;
	}
};
OSF.DDA.AsyncMethodCall=function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+2) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				case "function":
					if (parameterCallback) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
					}
					else {
						parameterCallback=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		if (parameterCallback) {
			if (options[Microsoft.Office.WebExtension.Parameters.Callback]) {
				throw Strings.OfficeOM.L_RedundantCallbackSpecification;
			}
			else {
				options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
			}
		}
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
	this.processResponse=function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, caller, callArgs) {
		var payload;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			if (onSucceeded) {
				payload=onSucceeded(response, caller, callArgs);
			}
			else {
				payload=response;
			}
		}
		else {
			if (onFailed) {
				payload=onFailed(status, response);
			}
			else {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
		}
		return payload;
	};
	this.getCallArgs=function (suppliedArgs) {
		var options, parameterCallback;
		for (var i=suppliedArgs.length - 1; i >=requiredCount; i--) {
			var argument=suppliedArgs[i];
			switch (typeof argument) {
				case "object":
					options=argument;
					break;
				case "function":
					parameterCallback=argument;
					break;
			}
		}
		options=options || {};
		if (parameterCallback) {
			options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
		}
		return options;
	};
};
OSF.DDA.AsyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			var privateStateCallbacks=params.privateStateCallbacks ? OSF.OUtil.createObject(params.privateStateCallbacks) : [];
			return new OSF.DDA.AsyncMethodCall(params.requiredArguments || [], supportedOptions, privateStateCallbacks, params.onSucceeded, params.onFailed, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.AsyncMethodCalls={};
OSF.DDA.AsyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.AsyncMethodCalls[callDefinition.method.id]=OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.Error=function OSF_DDA_Error(name, message, code) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"name": {
			value: name
		},
		"message": {
			value: message
		},
		"code": {
			value: code
		}
	});
};
OSF.DDA.AsyncResult=function OSF_DDA_AsyncResult(initArgs, errorArgs) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"value": {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]
		},
		"status": {
			value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded
		}
	});
	if (initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]) {
		OSF.OUtil.defineEnumerableProperty(this, "asyncContext", {
			value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]
		});
	}
	if (errorArgs) {
		OSF.OUtil.defineEnumerableProperty(this, "error", {
			value: new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])
		});
	}
};
OSF.DDA.issueAsyncResult=function OSF_DDA$IssueAsyncResult(callArgs, status, payload) {
	var callback=callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
	if (callback) {
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
		var errorArgs;
		if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
		}
		else {
			errorArgs={};
			payload=payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
		}
		callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
	}
};
OSF.DDA.SyncMethodNames={};
OSF.DDA.SyncMethodNames.addNames=function (methodNames) {
	for (var entry in methodNames) {
		var am={};
		OSF.OUtil.defineEnumerableProperties(am, {
			"id": {
				value: entry
			},
			"displayName": {
				value: methodNames[entry]
			}
		});
		OSF.DDA.SyncMethodNames[entry]=am;
	}
};
OSF.DDA.SyncMethodCall=function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
	function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
		if (userArgs.length > requiredCount+1) {
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		}
		var options, parameterCallback;
		for (var i=userArgs.length - 1; i >=requiredCount; i--) {
			var argument=userArgs[i];
			switch (typeof argument) {
				case "object":
					if (options) {
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					}
					else {
						options=argument;
					}
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break;
			}
		}
		options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
		apiMethods.verifyArguments(supportedOptions, options);
		return options;
	}
	;
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
		var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
		var options=OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
		var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
		return callArgs;
	};
};
OSF.DDA.SyncMethodCallFactory=(function () {
	return {
		manufacture: function (params) {
			var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
			return new OSF.DDA.SyncMethodCall(params.requiredArguments || [], supportedOptions, params.privateStateCallbacks, params.checkCallArgs, params.method.displayName);
		}
	};
})();
OSF.DDA.SyncMethodCalls={};
OSF.DDA.SyncMethodCalls.define=function (callDefinition) {
	OSF.DDA.SyncMethodCalls[callDefinition.method.id]=OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.ListType=(function () {
	var listTypes={};
	return {
		setListType: function OSF_DDA_ListType$AddListType(t, prop) { listTypes[t]=prop; },
		isListType: function OSF_DDA_ListType$IsListType(t) { return OSF.OUtil.listContainsKey(listTypes, t); },
		getDescriptor: function OSF_DDA_ListType$getDescriptor(t) { return listTypes[t]; }
	};
})();
OSF.DDA.HostParameterMap=function (specialProcessor, mappings) {
	var toHostMap="toHost";
	var fromHostMap="fromHost";
	var sourceData="sourceData";
	var self="self";
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]={
		toHost: function (data) {
			if (data !=null && data.rows !==undefined) {
				var tableData={};
				tableData[OSF.DDA.TableDataProperties.TableRows]=data.rows;
				tableData[OSF.DDA.TableDataProperties.TableHeaders]=data.headers;
				data=tableData;
			}
			return data;
		},
		fromHost: function (args) {
			return args;
		}
	};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.SampleData]=dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data];
	function mapValues(preimageSet, mapping) {
		var ret=preimageSet ? {} : undefined;
		for (var entry in preimageSet) {
			var preimage=preimageSet[entry];
			var image;
			if (OSF.DDA.ListType.isListType(entry)) {
				image=[];
				for (var subEntry in preimage) {
					image.push(mapValues(preimage[subEntry], mapping));
				}
			}
			else if (OSF.OUtil.listContainsKey(dynamicTypes, entry)) {
				image=dynamicTypes[entry][mapping](preimage);
			}
			else if (mapping==fromHostMap && specialProcessor.preserveNesting(entry)) {
				image=mapValues(preimage, mapping);
			}
			else {
				var maps=mappings[entry];
				if (maps) {
					var map=maps[mapping];
					if (map) {
						image=map[preimage];
						if (image===undefined) {
							image=preimage;
						}
					}
				}
				else {
					image=preimage;
				}
			}
			ret[entry]=image;
		}
		return ret;
	}
	;
	function generateArguments(imageSet, parameters) {
		var ret;
		for (var param in parameters) {
			var arg;
			if (specialProcessor.isComplexType(param)) {
				arg=generateArguments(imageSet, mappings[param][toHostMap]);
			}
			else {
				arg=imageSet[param];
			}
			if (arg !=undefined) {
				if (!ret) {
					ret={};
				}
				var index=parameters[param];
				if (index==self) {
					index=param;
				}
				ret[index]=specialProcessor.pack(param, arg);
			}
		}
		return ret;
	}
	;
	function extractArguments(source, parameters, extracted) {
		if (!extracted) {
			extracted={};
		}
		for (var param in parameters) {
			var index=parameters[param];
			var value;
			if (index==self) {
				value=source;
			}
			else if (index==sourceData) {
				extracted[param]=source.toArray();
				continue;
			}
			else {
				value=source[index];
			}
			if (value===null || value===undefined) {
				extracted[param]=undefined;
			}
			else {
				value=specialProcessor.unpack(param, value);
				var map;
				if (specialProcessor.isComplexType(param)) {
					map=mappings[param][fromHostMap];
					if (specialProcessor.preserveNesting(param)) {
						extracted[param]=extractArguments(value, map);
					}
					else {
						extractArguments(value, map, extracted);
					}
				}
				else {
					if (OSF.DDA.ListType.isListType(param)) {
						map={};
						var entryDescriptor=OSF.DDA.ListType.getDescriptor(param);
						map[entryDescriptor]=self;
						var extractedValues=new Array(value.length);
						for (var item in value) {
							extractedValues[item]=extractArguments(value[item], map);
						}
						extracted[param]=extractedValues;
					}
					else {
						extracted[param]=value;
					}
				}
			}
		}
		return extracted;
	}
	;
	function applyMap(mapName, preimage, mapping) {
		var parameters=mappings[mapName][mapping];
		var image;
		if (mapping=="toHost") {
			var imageSet=mapValues(preimage, mapping);
			image=generateArguments(imageSet, parameters);
		}
		else if (mapping=="fromHost") {
			var argumentSet=extractArguments(preimage, parameters);
			image=mapValues(argumentSet, mapping);
		}
		return image;
	}
	;
	if (!mappings) {
		mappings={};
	}
	this.addMapping=function (mapName, description) {
		var toHost, fromHost;
		if (description.map) {
			toHost=description.map;
			fromHost={};
			for (var preimage in toHost) {
				var image=toHost[preimage];
				if (image==self) {
					image=preimage;
				}
				fromHost[image]=preimage;
			}
		}
		else {
			toHost=description.toHost;
			fromHost=description.fromHost;
		}
		var pair=mappings[mapName];
		if (pair) {
			var currMap=pair[toHostMap];
			for (var th in currMap)
				toHost[th]=currMap[th];
			currMap=pair[fromHostMap];
			for (var fh in currMap)
				fromHost[fh]=currMap[fh];
		}
		else {
			pair=mappings[mapName]={};
		}
		pair[toHostMap]=toHost;
		pair[fromHostMap]=fromHost;
	};
	this.toHost=function (mapName, preimage) { return applyMap(mapName, preimage, toHostMap); };
	this.fromHost=function (mapName, image) { return applyMap(mapName, image, fromHostMap); };
	this.self=self;
	this.sourceData=sourceData;
	this.addComplexType=function (ct) { specialProcessor.addComplexType(ct); };
	this.getDynamicType=function (dt) { return specialProcessor.getDynamicType(dt); };
	this.setDynamicType=function (dt, handler) { specialProcessor.setDynamicType(dt, handler); };
	this.dynamicTypes=dynamicTypes;
	this.doMapValues=function (preimageSet, mapping) { return mapValues(preimageSet, mapping); };
};
OSF.DDA.SpecialProcessor=function (complexTypes, dynamicTypes) {
	this.addComplexType=function OSF_DDA_SpecialProcessor$addComplexType(ct) {
		complexTypes.push(ct);
	};
	this.getDynamicType=function OSF_DDA_SpecialProcessor$getDynamicType(dt) {
		return dynamicTypes[dt];
	};
	this.setDynamicType=function OSF_DDA_SpecialProcessor$setDynamicType(dt, handler) {
		dynamicTypes[dt]=handler;
	};
	this.isComplexType=function OSF_DDA_SpecialProcessor$isComplexType(t) {
		return OSF.OUtil.listContainsValue(complexTypes, t);
	};
	this.isDynamicType=function OSF_DDA_SpecialProcessor$isDynamicType(p) {
		return OSF.OUtil.listContainsKey(dynamicTypes, p);
	};
	this.preserveNesting=function OSF_DDA_SpecialProcessor$preserveNesting(p) {
		var pn=[];
		if (OSF.DDA.PropertyDescriptors)
			pn.push(OSF.DDA.PropertyDescriptors.Subset);
		if (OSF.DDA.DataNodeEventProperties) {
			pn=pn.concat([
				OSF.DDA.DataNodeEventProperties.OldNode,
				OSF.DDA.DataNodeEventProperties.NewNode,
				OSF.DDA.DataNodeEventProperties.NextSiblingNode
			]);
		}
		return OSF.OUtil.listContainsValue(pn, p);
	};
	this.pack=function OSF_DDA_SpecialProcessor$pack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].toHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
	this.unpack=function OSF_DDA_SpecialProcessor$unpack(param, arg) {
		var value;
		if (this.isDynamicType(param)) {
			value=dynamicTypes[param].fromHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
};
OSF.DDA.getDecoratedParameterMap=function (specialProcessor, initialDefs) {
	var parameterMap=new OSF.DDA.HostParameterMap(specialProcessor);
	var self=parameterMap.self;
	function createObject(properties) {
		var obj=null;
		if (properties) {
			obj={};
			var len=properties.length;
			for (var i=0; i < len; i++) {
				obj[properties[i].name]=properties[i].value;
			}
		}
		return obj;
	}
	parameterMap.define=function define(definition) {
		var args={};
		var toHost=createObject(definition.toHost);
		if (definition.invertible) {
			args.map=toHost;
		}
		else if (definition.canonical) {
			args.toHost=args.fromHost=toHost;
		}
		else {
			args.toHost=toHost;
			args.fromHost=createObject(definition.fromHost);
		}
		parameterMap.addMapping(definition.type, args);
		if (definition.isComplexType)
			parameterMap.addComplexType(definition.type);
	};
	for (var id in initialDefs)
		parameterMap.define(initialDefs[id]);
	return parameterMap;
};
OSF.OUtil.setNamespace("DispIdHost", OSF.DDA);
OSF.DDA.DispIdHost.Methods={
	InvokeMethod: "invokeMethod",
	AddEventHandler: "addEventHandler",
	RemoveEventHandler: "removeEventHandler",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent",
	SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Delegates={
	ExecuteAsync: "executeAsync",
	RegisterEventAsync: "registerEventAsync",
	UnregisterEventAsync: "unregisterEventAsync",
	ParameterMap: "parameterMap",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent",
	SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Facade=function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap) {
	var dispIdMap={};
	var jsom=OSF.DDA.AsyncMethodNames;
	var did=OSF.DDA.MethodDispId;
	var methodMap={
		"GoToByIdAsync": did.dispidNavigateToMethod,
		"GetSelectedDataAsync": did.dispidGetSelectedDataMethod,
		"SetSelectedDataAsync": did.dispidSetSelectedDataMethod,
		"GetDocumentCopyChunkAsync": did.dispidGetDocumentCopyChunkMethod,
		"ReleaseDocumentCopyAsync": did.dispidReleaseDocumentCopyMethod,
		"GetDocumentCopyAsync": did.dispidGetDocumentCopyMethod,
		"AddFromSelectionAsync": did.dispidAddBindingFromSelectionMethod,
		"AddFromPromptAsync": did.dispidAddBindingFromPromptMethod,
		"AddFromNamedItemAsync": did.dispidAddBindingFromNamedItemMethod,
		"GetAllAsync": did.dispidGetAllBindingsMethod,
		"GetByIdAsync": did.dispidGetBindingMethod,
		"ReleaseByIdAsync": did.dispidReleaseBindingMethod,
		"GetDataAsync": did.dispidGetBindingDataMethod,
		"SetDataAsync": did.dispidSetBindingDataMethod,
		"AddRowsAsync": did.dispidAddRowsMethod,
		"AddColumnsAsync": did.dispidAddColumnsMethod,
		"DeleteAllDataValuesAsync": did.dispidClearAllRowsMethod,
		"RefreshAsync": did.dispidLoadSettingsMethod,
		"SaveAsync": did.dispidSaveSettingsMethod,
		"GetActiveViewAsync": did.dispidGetActiveViewMethod,
		"GetFilePropertiesAsync": did.dispidGetFilePropertiesMethod,
		"GetOfficeThemeAsync": did.dispidGetOfficeThemeMethod,
		"GetDocumentThemeAsync": did.dispidGetDocumentThemeMethod,
		"ClearFormatsAsync": did.dispidClearFormatsMethod,
		"SetTableOptionsAsync": did.dispidSetTableOptionsMethod,
		"SetFormatsAsync": did.dispidSetFormatsMethod,
		"GetAccessTokenAsync": did.dispidGetAccessTokenMethod,
		"ExecuteRichApiRequestAsync": did.dispidExecuteRichApiRequestMethod,
		"AppCommandInvocationCompletedAsync": did.dispidAppCommandInvocationCompletedMethod,
		"CloseContainerAsync": did.dispidCloseContainerMethod,
		"AddDataPartAsync": did.dispidAddDataPartMethod,
		"GetDataPartByIdAsync": did.dispidGetDataPartByIdMethod,
		"GetDataPartsByNameSpaceAsync": did.dispidGetDataPartsByNamespaceMethod,
		"GetPartXmlAsync": did.dispidGetDataPartXmlMethod,
		"GetPartNodesAsync": did.dispidGetDataPartNodesMethod,
		"DeleteDataPartAsync": did.dispidDeleteDataPartMethod,
		"GetNodeValueAsync": did.dispidGetDataNodeValueMethod,
		"GetNodeXmlAsync": did.dispidGetDataNodeXmlMethod,
		"GetRelativeNodesAsync": did.dispidGetDataNodesMethod,
		"SetNodeValueAsync": did.dispidSetDataNodeValueMethod,
		"SetNodeXmlAsync": did.dispidSetDataNodeXmlMethod,
		"AddDataPartNamespaceAsync": did.dispidAddDataNamespaceMethod,
		"GetDataPartNamespaceAsync": did.dispidGetDataUriByPrefixMethod,
		"GetDataPartPrefixAsync": did.dispidGetDataPrefixByUriMethod,
		"GetNodeTextAsync": did.dispidGetDataNodeTextMethod,
		"SetNodeTextAsync": did.dispidSetDataNodeTextMethod,
		"GetSelectedTask": did.dispidGetSelectedTaskMethod,
		"GetTask": did.dispidGetTaskMethod,
		"GetWSSUrl": did.dispidGetWSSUrlMethod,
		"GetTaskField": did.dispidGetTaskFieldMethod,
		"GetSelectedResource": did.dispidGetSelectedResourceMethod,
		"GetResourceField": did.dispidGetResourceFieldMethod,
		"GetProjectField": did.dispidGetProjectFieldMethod,
		"GetSelectedView": did.dispidGetSelectedViewMethod,
		"GetTaskByIndex": did.dispidGetTaskByIndexMethod,
		"GetResourceByIndex": did.dispidGetResourceByIndexMethod,
		"SetTaskField": did.dispidSetTaskFieldMethod,
		"SetResourceField": did.dispidSetResourceFieldMethod,
		"GetMaxTaskIndex": did.dispidGetMaxTaskIndexMethod,
		"GetMaxResourceIndex": did.dispidGetMaxResourceIndexMethod,
		"CreateTask": did.dispidCreateTaskMethod
	};
	for (var method in methodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=methodMap[method];
		}
	}
	jsom=OSF.DDA.SyncMethodNames;
	did=OSF.DDA.MethodDispId;
	var asyncMethodMap={
		"MessageParent": did.dispidMessageParentMethod,
		"SendMessage": did.dispidSendMessageMethod
	};
	for (var method in asyncMethodMap) {
		if (jsom[method]) {
			dispIdMap[jsom[method].id]=asyncMethodMap[method];
		}
	}
	jsom=Microsoft.Office.WebExtension.EventType;
	did=OSF.DDA.EventDispId;
	var eventMap={
		"SettingsChanged": did.dispidSettingsChangedEvent,
		"DocumentSelectionChanged": did.dispidDocumentSelectionChangedEvent,
		"BindingSelectionChanged": did.dispidBindingSelectionChangedEvent,
		"BindingDataChanged": did.dispidBindingDataChangedEvent,
		"ActiveViewChanged": did.dispidActiveViewChangedEvent,
		"OfficeThemeChanged": did.dispidOfficeThemeChangedEvent,
		"DocumentThemeChanged": did.dispidDocumentThemeChangedEvent,
		"AppCommandInvoked": did.dispidAppCommandInvokedEvent,
		"DialogMessageReceived": did.dispidDialogMessageReceivedEvent,
		"DialogParentMessageReceived": did.dispidDialogParentMessageReceivedEvent,
		"ObjectDeleted": did.dispidObjectDeletedEvent,
		"ObjectSelectionChanged": did.dispidObjectSelectionChangedEvent,
		"ObjectDataChanged": did.dispidObjectDataChangedEvent,
		"ContentControlAdded": did.dispidContentControlAddedEvent,
		"ItemChanged": did.dispidOlkItemSelectedChangedEvent,
		"TaskSelectionChanged": did.dispidTaskSelectionChangedEvent,
		"ResourceSelectionChanged": did.dispidResourceSelectionChangedEvent,
		"ViewSelectionChanged": did.dispidViewSelectionChangedEvent,
		"DataNodeInserted": did.dispidDataNodeAddedEvent,
		"DataNodeReplaced": did.dispidDataNodeReplacedEvent,
		"DataNodeDeleted": did.dispidDataNodeDeletedEvent
	};
	for (var event in eventMap) {
		if (jsom[event]) {
			dispIdMap[jsom[event]]=eventMap[event];
		}
	}
	function IsObjectEvent(dispId) {
		return (dispId==OSF.DDA.EventDispId.dispidObjectDeletedEvent ||
			dispId==OSF.DDA.EventDispId.dispidObjectSelectionChangedEvent ||
			dispId==OSF.DDA.EventDispId.dispidObjectDataChangedEvent ||
			dispId==OSF.DDA.EventDispId.dispidContentControlAddedEvent);
	}
	function onException(ex, asyncMethodCall, suppliedArgs, callArgs) {
		if (typeof ex=="number") {
			if (!callArgs) {
				callArgs=asyncMethodCall.getCallArgs(suppliedArgs);
			}
			OSF.DDA.issueAsyncResult(callArgs, ex, OSF.DDA.ErrorCodeManager.getErrorArgs(ex));
		}
		else {
			throw ex;
		}
	}
	;
	this[OSF.DDA.DispIdHost.Methods.InvokeMethod]=function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, caller, privateState) {
		var callArgs;
		try {
			var methodName=method.id;
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[methodName];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, privateState);
			var dispId=dispIdMap[methodName];
			var delegate=getDelegateMethods(methodName);
			var richApiInExcelMethodSubstitution=null;
			if (window.Excel && window.Office.context.requirements.isSetSupported("RedirectV1Api")) {
				window.Excel._RedirectV1APIs=true;
			}
			if (window.Excel && window.Excel._RedirectV1APIs && (richApiInExcelMethodSubstitution=window.Excel._V1APIMap[methodName])) {
				var preprocessedCallArgs=OSF.OUtil.shallowCopy(callArgs);
				delete preprocessedCallArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
				if (richApiInExcelMethodSubstitution.preprocess) {
					preprocessedCallArgs=richApiInExcelMethodSubstitution.preprocess(preprocessedCallArgs);
				}
				var ctx=new window.Excel.RequestContext();
				var result=richApiInExcelMethodSubstitution.call(ctx, preprocessedCallArgs);
				ctx.sync()
					.then(function () {
					var response=result.value;
					var status=response.status;
					delete response["status"];
					delete response["@odata.type"];
					if (richApiInExcelMethodSubstitution.postprocess) {
						response=richApiInExcelMethodSubstitution.postprocess(response, preprocessedCallArgs);
					}
					if (status !=0) {
						response=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, response);
				})["catch"](function (error) {
					OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeFailure, null);
				});
			}
			else {
				var hostCallArgs;
				if (parameterMap.toHost) {
					hostCallArgs=parameterMap.toHost(dispId, callArgs);
				}
				else {
					hostCallArgs=callArgs;
				}
				delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
					"dispId": dispId,
					"hostCallArgs": hostCallArgs,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { },
					"onComplete": function (status, hostResponseArgs) {
						var responseArgs;
						if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
							if (parameterMap.fromHost) {
								responseArgs=parameterMap.fromHost(dispId, hostResponseArgs);
							}
							else {
								responseArgs=hostResponseArgs;
							}
						}
						else {
							responseArgs=hostResponseArgs;
						}
						var payload=asyncMethodCall.processResponse(status, responseArgs, caller, callArgs);
						OSF.DDA.issueAsyncResult(callArgs, status, payload);
					}
				});
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.AddEventHandler]=function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, caller, isPopupWindow) {
		var callArgs;
		var eventType, handler;
		var isObjectEvent=false;
		function onEnsureRegistration(status) {
			if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				var added=!isObjectEvent ? eventDispatch.addEventHandler(eventType, handler) :
					eventDispatch.addObjectEventHandler(eventType, callArgs[Microsoft.Office.WebExtension.Parameters.Id], handler);
				if (!added) {
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed;
				}
			}
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			if (isPopupWindow) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
				return;
			}
			var dispId=dispIdMap[eventType];
			isObjectEvent=IsObjectEvent(dispId);
			var targetId=(isObjectEvent ? callArgs[Microsoft.Office.WebExtension.Parameters.Id] : (caller.id || ""));
			var count=isObjectEvent ? eventDispatch.getObjectEventHandlerCount(eventType, targetId) : eventDispatch.getEventHandlerCount(eventType);
			if (count==0) {
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": targetId,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration,
					"onEvent": function handleEvent(hostArgs) {
						var args=parameterMap.fromHost(dispId, hostArgs);
						if (!isObjectEvent)
							eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType, caller, args));
						else
							eventDispatch.fireObjectEvent(targetId, OSF.DDA.OMFactory.manufactureEventArgs(eventType, targetId, args));
					}
				});
			}
			else {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler]=function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var eventType, handler;
		var isObjectEvent=false;
		function onEnsureRegistration(status) {
			var error;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, error);
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			var dispId=dispIdMap[eventType];
			isObjectEvent=IsObjectEvent(dispId);
			var targetId=(isObjectEvent ? callArgs[Microsoft.Office.WebExtension.Parameters.Id] : (caller.id || ""));
			var status, removeSuccess;
			if (handler===null) {
				removeSuccess=isObjectEvent ? eventDispatch.clearObjectEventHandlers(eventType, targetId) : eventDispatch.clearEventHandlers(eventType);
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
			}
			else {
				removeSuccess=isObjectEvent ? eventDispatch.removeObjectEventHandler(eventType, targetId, handler) : eventDispatch.removeEventHandler(eventType, handler);
				status=removeSuccess ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist;
			}
			var count=isObjectEvent ? eventDispatch.getObjectEventHandlerCount(eventType, targetId) : eventDispatch.getEventHandlerCount(eventType);
			if (removeSuccess && count==0) {
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
				invoker({
					"eventType": eventType,
					"dispId": dispId,
					"targetId": targetId,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
					"onComplete": onEnsureRegistration
				});
			}
			else {
				onEnsureRegistration(status);
			}
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.OpenDialog]=function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller) {
		var callArgs;
		var targetId;
		var dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
		var dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
		function onEnsureRegistration(status) {
			var payload;
			if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			}
			else {
				var onSucceedArgs={};
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id]=targetId;
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data]=eventDispatch;
				var payload=asyncMethodCall.processResponse(status, onSucceedArgs, caller, callArgs);
				OSF.DialogShownStatus.hasDialogShown=true;
				eventDispatch.clearEventHandlers(dialogMessageEvent);
				eventDispatch.clearEventHandlers(dialogOtherEvent);
			}
			OSF.DDA.issueAsyncResult(callArgs, status, payload);
		}
		try {
			if (dialogMessageEvent==undefined || dialogOtherEvent==undefined) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported);
			}
			if (OSF.DDA.AsyncMethodNames.DisplayDialogAsync==null) {
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				return;
			}
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
			targetId=JSON.stringify(callArgs);
			if (!OSF.DialogShownStatus.hasDialogShown) {
				eventDispatch.clearQueuedEvent(dialogMessageEvent);
				eventDispatch.clearQueuedEvent(dialogOtherEvent);
				eventDispatch.clearQueuedEvent(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived);
			}
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": onEnsureRegistration,
				"onEvent": function handleEvent(hostArgs) {
					var args=parameterMap.fromHost(dispId, hostArgs);
					var event=OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent, caller, args);
					if (event.type==dialogOtherEvent) {
						var payload=OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
						var errorArgs={};
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
						event.error=new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]);
					}
					eventDispatch.fireOrQueueEvent(event);
					if (args[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogClosed) {
						eventDispatch.clearEventHandlers(dialogMessageEvent);
						eventDispatch.clearEventHandlers(dialogOtherEvent);
						eventDispatch.clearEventHandlers(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived);
						OSF.DialogShownStatus.hasDialogShown=false;
					}
				}
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.CloseDialog]=function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller) {
		var callArgs;
		var dialogMessageEvent, dialogOtherEvent;
		var closeStatus=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
		function closeCallback(status) {
			closeStatus=status;
			OSF.DialogShownStatus.hasDialogShown=false;
		}
		try {
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
			dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
			dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
			eventDispatch.clearEventHandlers(dialogMessageEvent);
			eventDispatch.clearEventHandlers(dialogOtherEvent);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] !=undefined ?
				delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] :
				delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
			invoker({
				"eventType": dialogMessageEvent,
				"dispId": dispId,
				"targetId": targetId,
				"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
				"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
				"onComplete": closeCallback
			});
		}
		catch (ex) {
			onException(ex, asyncMethodCall, suppliedArguments, callArgs);
		}
		if (closeStatus !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
			throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed, OSF.DDA.AsyncMethodNames.CloseAsync.displayName, closeStatus);
		}
	};
	this[OSF.DDA.DispIdHost.Methods.MessageParent]=function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller) {
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
		return invoker({
			"dispId": dispId,
			"hostCallArgs": callArgs,
			"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
			"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
		});
	};
	this[OSF.DDA.DispIdHost.Methods.SendMessage]=function OSF_DDA_DispIdHost_Facade$SendMessage(suppliedArguments, eventDispatch, caller) {
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.SendMessage.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.SendMessage.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.SendMessage];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.SendMessage.id];
		return invoker({
			"dispId": dispId,
			"hostCallArgs": callArgs,
			"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
			"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
		});
	};
};
OSF.DDA.DispIdHost.addAsyncMethods=function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState) {
	for (var entry in asyncMethodNames) {
		var method=asyncMethodNames[entry];
		var name=method.displayName;
		if (!target[name]) {
			OSF.OUtil.defineEnumerableProperty(target, name, {
				value: (function (asyncMethod) {
					return function () {
						var invokeMethod=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
						invokeMethod(asyncMethod, arguments, target, privateState);
					};
				})(method)
			});
		}
	}
};
OSF.DDA.DispIdHost.addEventSupport=function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch, isPopupWindow) {
	var add=OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
	var remove=OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
	if (!target[add]) {
		OSF.OUtil.defineEnumerableProperty(target, add, {
			value: function () {
				var addEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
				addEventHandler(arguments, eventDispatch, target, isPopupWindow);
			}
		});
	}
	if (!target[remove]) {
		OSF.OUtil.defineEnumerableProperty(target, remove, {
			value: function () {
				var removeEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
				removeEventHandler(arguments, eventDispatch, target);
			}
		});
	}
};
var OfficeExt;
(function (OfficeExt) {
	var MsAjaxTypeHelper=(function () {
		function MsAjaxTypeHelper() {
		}
		MsAjaxTypeHelper.isInstanceOfType=function (type, instance) {
			if (typeof (instance)==="undefined" || instance===null)
				return false;
			if (instance instanceof type)
				return true;
			var instanceType=instance.constructor;
			if (!instanceType || (typeof (instanceType) !=="function") || !instanceType.__typeName || instanceType.__typeName==='Object') {
				instanceType=Object;
			}
			return !!(instanceType===type) ||
				(instanceType.__typeName && type.__typeName && instanceType.__typeName===type.__typeName);
		};
		return MsAjaxTypeHelper;
	})();
	OfficeExt.MsAjaxTypeHelper=MsAjaxTypeHelper;
	var MsAjaxError=(function () {
		function MsAjaxError() {
		}
		MsAjaxError.create=function (message, errorInfo) {
			var err=new Error(message);
			err.message=message;
			if (errorInfo) {
				for (var v in errorInfo) {
					err[v]=errorInfo[v];
				}
			}
			err.popStackFrame();
			return err;
		};
		MsAjaxError.parameterCount=function (message) {
			var displayMessage="Sys.ParameterCountException: "+(message ? message : "Parameter count mismatch.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.ParameterCountException' });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argument=function (paramName, message) {
			var displayMessage="Sys.ArgumentException: "+(message ? message : "Value does not fall within the expected range.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentNull=function (paramName, message) {
			var displayMessage="Sys.ArgumentNullException: "+(message ? message : "Value cannot be null.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentOutOfRange=function (paramName, actualValue, message) {
			var displayMessage="Sys.ArgumentOutOfRangeException: "+(message ? message : "Specified argument was out of the range of valid values.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			if (typeof (actualValue) !=="undefined" && actualValue !==null) {
				displayMessage+="\n"+MsAjaxString.format("Actual value was {0}.", actualValue);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentOutOfRangeException",
				paramName: paramName,
				actualValue: actualValue
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentType=function (paramName, actualType, expectedType, message) {
			var displayMessage="Sys.ArgumentTypeException: ";
			if (message) {
				displayMessage+=message;
			}
			else if (actualType && expectedType) {
				displayMessage+=MsAjaxString.format("Object of type '{0}' cannot be converted to type '{1}'.", actualType.getName ? actualType.getName() : actualType, expectedType.getName ? expectedType.getName() : expectedType);
			}
			else {
				displayMessage+="Object cannot be converted to the required type.";
			}
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentTypeException",
				paramName: paramName,
				actualType: actualType,
				expectedType: expectedType
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentUndefined=function (paramName, message) {
			var displayMessage="Sys.ArgumentUndefinedException: "+(message ? message : "Value cannot be undefined.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.invalidOperation=function (message) {
			var displayMessage="Sys.InvalidOperationException: "+(message ? message : "Operation is not valid due to the current state of the object.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.InvalidOperationException' });
			err.popStackFrame();
			return err;
		};
		return MsAjaxError;
	})();
	OfficeExt.MsAjaxError=MsAjaxError;
	var MsAjaxString=(function () {
		function MsAjaxString() {
		}
		MsAjaxString.format=function (format) {
			var args=[];
			for (var _i=1; _i < arguments.length; _i++) {
				args[_i - 1]=arguments[_i];
			}
			var source=format;
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10);
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		};
		MsAjaxString.startsWith=function (str, prefix) {
			return (str.substr(0, prefix.length)===prefix);
		};
		return MsAjaxString;
	})();
	OfficeExt.MsAjaxString=MsAjaxString;
	var MsAjaxDebug=(function () {
		function MsAjaxDebug() {
		}
		MsAjaxDebug.trace=function (text) {
			if (typeof Debug !=="undefined" && Debug.writeln)
				Debug.writeln(text);
			if (window.console && window.console.log)
				window.console.log(text);
			if (window.opera && window.opera.postError)
				window.opera.postError(text);
			if (window.debugService && window.debugService.trace)
				window.debugService.trace(text);
			var a=document.getElementById("TraceConsole");
			if (a && a.tagName.toUpperCase()==="TEXTAREA") {
				a.innerHTML+=text+"\n";
			}
		};
		return MsAjaxDebug;
	})();
	OfficeExt.MsAjaxDebug=MsAjaxDebug;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		var registerTypeInternal=function registerTypeInternal(type, name, isClass) {
			if (type.__typeName===undefined) {
				type.__typeName=name;
			}
			if (type.__class===undefined) {
				type.__class=isClass;
			}
		};
		registerTypeInternal(Function, "Function", true);
		registerTypeInternal(Error, "Error", true);
		registerTypeInternal(Object, "Object", true);
		registerTypeInternal(String, "String", true);
		registerTypeInternal(Boolean, "Boolean", true);
		registerTypeInternal(Date, "Date", true);
		registerTypeInternal(Number, "Number", true);
		registerTypeInternal(RegExp, "RegExp", true);
		registerTypeInternal(Array, "Array", true);
		if (!Function.createCallback) {
			Function.createCallback=function Function$createCallback(method, context) {
				var e=Function._validateParams(arguments, [
					{ name: "method", type: Function },
					{ name: "context", mayBeNull: true }
				]);
				if (e)
					throw e;
				return function () {
					var l=arguments.length;
					if (l > 0) {
						var args=[];
						for (var i=0; i < l; i++) {
							args[i]=arguments[i];
						}
						args[l]=context;
						return method.apply(this, args);
					}
					return method.call(this, context);
				};
			};
		}
		if (!Function.createDelegate) {
			Function.createDelegate=function Function$createDelegate(instance, method) {
				var e=Function._validateParams(arguments, [
					{ name: "instance", mayBeNull: true },
					{ name: "method", type: Function }
				]);
				if (e)
					throw e;
				return function () {
					return method.apply(instance, arguments);
				};
			};
		}
		if (!Function._validateParams) {
			Function._validateParams=function (params, expectedParams, validateParameterCount) {
				var e, expectedLength=expectedParams.length;
				validateParameterCount=validateParameterCount || (typeof (validateParameterCount)==="undefined");
				e=Function._validateParameterCount(params, expectedParams, validateParameterCount);
				if (e) {
					e.popStackFrame();
					return e;
				}
				for (var i=0, l=params.length; i < l; i++) {
					var expectedParam=expectedParams[Math.min(i, expectedLength - 1)], paramName=expectedParam.name;
					if (expectedParam.parameterArray) {
						paramName+="["+(i - expectedLength+1)+"]";
					}
					else if (!validateParameterCount && (i >=expectedLength)) {
						break;
					}
					e=Function._validateParameter(params[i], expectedParam, paramName);
					if (e) {
						e.popStackFrame();
						return e;
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterCount) {
			Function._validateParameterCount=function (params, expectedParams, validateParameterCount) {
				var i, error, expectedLen=expectedParams.length, actualLen=params.length;
				if (actualLen < expectedLen) {
					var minParams=expectedLen;
					for (i=0; i < expectedLen; i++) {
						var param=expectedParams[i];
						if (param.optional || param.parameterArray) {
							minParams--;
						}
					}
					if (actualLen < minParams) {
						error=true;
					}
				}
				else if (validateParameterCount && (actualLen > expectedLen)) {
					error=true;
					for (i=0; i < expectedLen; i++) {
						if (expectedParams[i].parameterArray) {
							error=false;
							break;
						}
					}
				}
				if (error) {
					var e=MsAjaxError.parameterCount();
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!Function._validateParameter) {
			Function._validateParameter=function (param, expectedParam, paramName) {
				var e, expectedType=expectedParam.type, expectedInteger=!!expectedParam.integer, expectedDomElement=!!expectedParam.domElement, mayBeNull=!!expectedParam.mayBeNull;
				e=Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
				if (e) {
					e.popStackFrame();
					return e;
				}
				var expectedElementType=expectedParam.elementType, elementMayBeNull=!!expectedParam.elementMayBeNull;
				if (expectedType===Array && typeof (param) !=="undefined" && param !==null &&
					(expectedElementType || !elementMayBeNull)) {
					var expectedElementInteger=!!expectedParam.elementInteger, expectedElementDomElement=!!expectedParam.elementDomElement;
					for (var i=0; i < param.length; i++) {
						var elem=param[i];
						e=Function._validateParameterType(elem, expectedElementType, expectedElementInteger, expectedElementDomElement, elementMayBeNull, paramName+"["+i+"]");
						if (e) {
							e.popStackFrame();
							return e;
						}
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterType) {
			Function._validateParameterType=function (param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
				var e, i;
				if (typeof (param)==="undefined") {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentUndefined(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (param===null) {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentNull(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (expectedType && !OfficeExt.MsAjaxTypeHelper.isInstanceOfType(expectedType, param)) {
					e=OfficeExt.MsAjaxError.argumentType(paramName, typeof (param), expectedType);
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!window.Type) {
			window.Type=Function;
		}
		if (!Type.registerNamespace) {
			Type.registerNamespace=function (ns) {
				var namespaceParts=ns.split('.');
				var currentNamespace=window;
				for (var i=0; i < namespaceParts.length; i++) {
					currentNamespace[namespaceParts[i]]=currentNamespace[namespaceParts[i]] || {};
					currentNamespace=currentNamespace[namespaceParts[i]];
				}
			};
		}
		if (!Type.prototype.registerClass) {
			Type.prototype.registerClass=function (cls) { cls={}; };
		}
		if (typeof (Sys)==="undefined") {
			Type.registerNamespace('Sys');
		}
		if (!Error.prototype.popStackFrame) {
			Error.prototype.popStackFrame=function () {
				if (arguments.length !==0)
					throw MsAjaxError.parameterCount();
				if (typeof (this.stack)==="undefined" || this.stack===null ||
					typeof (this.fileName)==="undefined" || this.fileName===null ||
					typeof (this.lineNumber)==="undefined" || this.lineNumber===null) {
					return;
				}
				var stackFrames=this.stack.split("\n");
				var currentFrame=stackFrames[0];
				var pattern=this.fileName+":"+this.lineNumber;
				while (typeof (currentFrame) !=="undefined" &&
					currentFrame !==null &&
					currentFrame.indexOf(pattern)===-1) {
					stackFrames.shift();
					currentFrame=stackFrames[0];
				}
				var nextFrame=stackFrames[1];
				if (typeof (nextFrame)==="undefined" || nextFrame===null) {
					return;
				}
				var nextFrameParts=nextFrame.match(/@(.*):(\d+)$/);
				if (typeof (nextFrameParts)==="undefined" || nextFrameParts===null) {
					return;
				}
				this.fileName=nextFrameParts[1];
				this.lineNumber=parseInt(nextFrameParts[2]);
				stackFrames.shift();
				this.stack=stackFrames.join("\n");
			};
		}
		OsfMsAjaxFactory.msAjaxError=MsAjaxError;
		OsfMsAjaxFactory.msAjaxString=MsAjaxString;
		OsfMsAjaxFactory.msAjaxDebug=MsAjaxDebug;
	}
})(OfficeExt || (OfficeExt={}));
OSF.OUtil.setNamespace("SafeArray", OSF.DDA);
OSF.DDA.SafeArray.Response={
	Status: 0,
	Payload: 1
};
OSF.DDA.SafeArray.UniqueArguments={
	Offset: "offset",
	Run: "run",
	BindingSpecificData: "bindingSpecificData",
	MergedCellGuid: "{66e7831f-81b2-42e2-823c-89e872d541b3}"
};
OSF.OUtil.setNamespace("Delegate", OSF.DDA.SafeArray);
OSF.DDA.SafeArray.Delegate._onException=function OSF_DDA_SafeArray_Delegate$OnException(ex, args) {
	var status;
	var statusNumber=ex.number;
	if (statusNumber) {
		switch (statusNumber) {
			case -2146828218:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
				break;
			case -2147467259:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened;
				break;
			case -2146828283:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidParam;
				break;
			case -2147209089:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidParam;
				break;
			case -2146827850:
			default:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				break;
		}
	}
	if (args.onComplete) {
		args.onComplete(status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
	}
};
OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod=function OSF_DDA_SafeArray_Delegate$OnExceptionSyncMethod(ex, args) {
	var status;
	var number=ex.number;
	if (number) {
		switch (number) {
			case -2146828218:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
				break;
			case -2146827850:
			default:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				break;
		}
	}
	return status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
};
OSF.DDA.SafeArray.Delegate.SpecialProcessor=function OSF_DDA_SafeArray_Delegate_SpecialProcessor() {
	function _2DVBArrayToJaggedArray(vbArr) {
		var ret;
		try {
			var rows=vbArr.ubound(1);
			var cols=vbArr.ubound(2);
			vbArr=vbArr.toArray();
			if (rows==1 && cols==1) {
				ret=[vbArr];
			}
			else {
				ret=[];
				for (var row=0; row < rows; row++) {
					var rowArr=[];
					for (var col=0; col < cols; col++) {
						var datum=vbArr[row * cols+col];
						if (datum !=OSF.DDA.SafeArray.UniqueArguments.MergedCellGuid) {
							rowArr.push(datum);
						}
					}
					if (rowArr.length > 0) {
						ret.push(rowArr);
					}
				}
			}
		}
		catch (ex) {
		}
		return ret;
	}
	var complexTypes=[];
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]=(function () {
		var tableRows=0;
		var tableHeaders=1;
		return {
			toHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$toHost(data) {
				if (OSF.DDA.TableDataProperties && typeof data !="string" && data[OSF.DDA.TableDataProperties.TableRows] !==undefined) {
					var tableData=[];
					tableData[tableRows]=data[OSF.DDA.TableDataProperties.TableRows];
					tableData[tableHeaders]=data[OSF.DDA.TableDataProperties.TableHeaders];
					data=tableData;
				}
				return data;
			},
			fromHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$fromHost(hostArgs) {
				var ret;
				if (hostArgs.toArray) {
					var dimensions=hostArgs.dimensions();
					if (dimensions===2) {
						ret=_2DVBArrayToJaggedArray(hostArgs);
					}
					else {
						var array=hostArgs.toArray();
						if (array.length===2 && ((array[0] !=null && array[0].toArray) || (array[1] !=null && array[1].toArray))) {
							ret={};
							ret[OSF.DDA.TableDataProperties.TableRows]=_2DVBArrayToJaggedArray(array[tableRows]);
							ret[OSF.DDA.TableDataProperties.TableHeaders]=_2DVBArrayToJaggedArray(array[tableHeaders]);
						}
						else {
							ret=array;
						}
					}
				}
				else {
					ret=hostArgs;
				}
				return ret;
			}
		};
	})();
	OSF.DDA.SafeArray.Delegate.SpecialProcessor.uber.constructor.call(this, complexTypes, dynamicTypes);
	this.unpack=function OSF_DDA_SafeArray_Delegate_SpecialProcessor$unpack(param, arg) {
		var value;
		if (this.isComplexType(param) || OSF.DDA.ListType.isListType(param)) {
			var toArraySupported=(arg || typeof arg==="unknown") && arg.toArray;
			value=toArraySupported ? arg.toArray() : arg || {};
		}
		else if (this.isDynamicType(param)) {
			value=dynamicTypes[param].fromHost(arg);
		}
		else {
			value=arg;
		}
		return value;
	};
};
OSF.OUtil.extend(OSF.DDA.SafeArray.Delegate.SpecialProcessor, OSF.DDA.SpecialProcessor);
OSF.DDA.SafeArray.Delegate.ParameterMap=OSF.DDA.getDecoratedParameterMap(new OSF.DDA.SafeArray.Delegate.SpecialProcessor(), [
	{
		type: Microsoft.Office.WebExtension.Parameters.ValueFormat,
		toHost: [
			{ name: Microsoft.Office.WebExtension.ValueFormat.Unformatted, value: 0 },
			{ name: Microsoft.Office.WebExtension.ValueFormat.Formatted, value: 1 }
		]
	},
	{
		type: Microsoft.Office.WebExtension.Parameters.FilterType,
		toHost: [
			{ name: Microsoft.Office.WebExtension.FilterType.All, value: 0 }
		]
	}
]);
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.AsyncResultStatus,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded, value: 0 },
		{ name: Microsoft.Office.WebExtension.AsyncResultStatus.Failed, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.executeAsync=function OSF_DDA_SafeArray_Delegate$ExecuteAsync(args) {
	function toArray(args) {
		var arrArgs=args;
		if (OSF.OUtil.isArray(args)) {
			var len=arrArgs.length;
			for (var i=0; i < len; i++) {
				arrArgs[i]=toArray(arrArgs[i]);
			}
		}
		else if (OSF.OUtil.isDate(args)) {
			arrArgs=args.getVarDate();
		}
		else if (typeof args==="object" && !OSF.OUtil.isArray(args)) {
			arrArgs=[];
			for (var index in args) {
				if (!OSF.OUtil.isFunction(args[index])) {
					arrArgs[index]=toArray(args[index]);
				}
			}
		}
		return arrArgs;
	}
	function fromSafeArray(value) {
		var ret=value;
		if (value !=null && value.toArray) {
			var arrayResult=value.toArray();
			ret=new Array(arrayResult.length);
			for (var i=0; i < arrayResult.length; i++) {
				ret[i]=fromSafeArray(arrayResult[i]);
			}
		}
		return ret;
	}
	try {
		if (args.onCalling) {
			args.onCalling();
		}
		var startTime=(new Date()).getTime();
		OSF.ClientHostController.execute(args.dispId, toArray(args.hostCallArgs), function OSF_DDA_SafeArrayFacade$Execute_OnResponse(hostResponseArgs, resultCode) {
			var result=hostResponseArgs.toArray();
			var status=result[OSF.DDA.SafeArray.Response.Status];
			if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeChunkResult) {
				var payload=result[OSF.DDA.SafeArray.Response.Payload];
				payload=fromSafeArray(payload);
				if (payload !=null) {
					if (!args._chunkResultData) {
						args._chunkResultData=new Array();
					}
					args._chunkResultData[payload[0]]=payload[1];
				}
				return false;
			}
			if (args.onReceiving) {
				args.onReceiving();
			}
			if (args.onComplete) {
				var payload;
				if (status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					if (result.length > 2) {
						payload=[];
						for (var i=1; i < result.length; i++)
							payload[i - 1]=result[i];
					}
					else {
						payload=result[OSF.DDA.SafeArray.Response.Payload];
					}
					if (args._chunkResultData) {
						payload=fromSafeArray(payload);
						if (payload !=null) {
							var expectedChunkCount=payload[payload.length - 1];
							if (args._chunkResultData.length==expectedChunkCount) {
								payload[payload.length - 1]=args._chunkResultData;
							}
							else {
								status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
							}
						}
					}
				}
				else {
					payload=result[OSF.DDA.SafeArray.Response.Payload];
				}
				args.onComplete(status, payload);
			}
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), status);
			}
			return true;
		});
	}
	catch (ex) {
		OSF.DDA.SafeArray.Delegate._onException(ex, args);
	}
};
OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent=function OSF_DDA_SafeArrayDelegate$GetOnAfterRegisterEvent(register, args) {
	var startTime=(new Date()).getTime();
	return function OSF_DDA_SafeArrayDelegate$OnAfterRegisterEvent(hostResponseArgs) {
		if (args.onReceiving) {
			args.onReceiving();
		}
		var status=hostResponseArgs.toArray ? hostResponseArgs.toArray()[OSF.DDA.SafeArray.Response.Status] : hostResponseArgs;
		if (args.onComplete) {
			args.onComplete(status);
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onRegisterDone(register, args.dispId, Math.abs((new Date()).getTime() - startTime), status);
		}
	};
};
OSF.DDA.SafeArray.Delegate.registerEventAsync=function OSF_DDA_SafeArray_Delegate$RegisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true, args);
	try {
		OSF.ClientHostController.registerEvent(args.dispId, args.targetId, function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload) {
			if (args.onEvent) {
				args.onEvent(payload);
			}
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.onEventDone(args.dispId);
			}
		}, callback);
	}
	catch (ex) {
		OSF.DDA.SafeArray.Delegate._onException(ex, args);
	}
};
OSF.DDA.SafeArray.Delegate.unregisterEventAsync=function OSF_DDA_SafeArray_Delegate$UnregisterEventAsync(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false, args);
	try {
		OSF.ClientHostController.unregisterEvent(args.dispId, args.targetId, callback);
	}
	catch (ex) {
		OSF.DDA.SafeArray.Delegate._onException(ex, args);
	}
};
OSF.ClientMode={
	ReadWrite: 0,
	ReadOnly: 1
};
OSF.DDA.RichInitializationReason={
	1: Microsoft.Office.WebExtension.InitializationReason.Inserted,
	2: Microsoft.Office.WebExtension.InitializationReason.DocumentOpened
};
OSF.InitializationHelper=function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
	this._hostInfo=hostInfo;
	this._webAppState=webAppState;
	this._context=context;
	this._settings=settings;
	this._hostFacade=hostFacade;
	this._initializeSettings=this.initializeSettings;
};
OSF.InitializationHelper.prototype.deserializeSettings=function OSF_InitializationHelper$deserializeSettings(serializedSettings, refreshSupported) {
	var settings;
	var osfSessionStorage=OSF.OUtil.getSessionStorage();
	if (osfSessionStorage) {
		var storageSettings=osfSessionStorage.getItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey());
		if (storageSettings) {
			serializedSettings=JSON.parse(storageSettings);
		}
		else {
			storageSettings=JSON.stringify(serializedSettings);
			osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
		}
	}
	var deserializedSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
	if (refreshSupported) {
		settings=new OSF.DDA.RefreshableSettings(deserializedSettings);
	}
	else {
		settings=new OSF.DDA.Settings(deserializedSettings);
	}
	return settings;
};
OSF.InitializationHelper.prototype.saveAndSetDialogInfo=function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue) {
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication=function OSF_InitializationHelper$setAgaveHostCommunication() {
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize=function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
	this.prepareApiSurface(appContext);
	Microsoft.Office.WebExtension.initialize(this.getInitializationReason(appContext));
};
OSF.InitializationHelper.prototype.prepareApiSurface=function OSF_InitializationHelper$prepareApiSurfaceAndInitialize(appContext) {
	var license=new OSF.DDA.License(appContext.get_eToken());
	var getOfficeThemeHandler=(OSF.DDA.OfficeTheme && OSF.DDA.OfficeTheme.getOfficeTheme) ? OSF.DDA.OfficeTheme.getOfficeTheme : null;
	if (appContext.get_isDialog()) {
		if (OSF.DDA.UI.ChildUI) {
			appContext.ui=new OSF.DDA.UI.ChildUI();
		}
	}
	else {
		if (OSF.DDA.UI.ParentUI) {
			appContext.ui=new OSF.DDA.UI.ParentUI();
			if (OfficeExt.Container) {
				OSF.DDA.DispIdHost.addAsyncMethods(appContext.ui, [OSF.DDA.AsyncMethodNames.CloseContainerAsync]);
			}
		}
	}
	if (OSF.DDA.Auth) {
		appContext.auth=new OSF.DDA.Auth();
		OSF.DDA.DispIdHost.addAsyncMethods(appContext.auth, [OSF.DDA.AsyncMethodNames.GetAccessTokenAsync]);
	}
	OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license, null, getOfficeThemeHandler));
	var getDelegateMethods, parameterMap;
	getDelegateMethods=OSF.DDA.DispIdHost.getClientDelegateMethods;
	parameterMap=OSF.DDA.SafeArray.Delegate.ParameterMap;
	OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods, parameterMap));
};
OSF.InitializationHelper.prototype.getInitializationReason=function (appContext) { return OSF.DDA.RichInitializationReason[appContext.get_reason()]; };
OSF.DDA.DispIdHost.getClientDelegateMethods=function (actionId) {
	var delegateMethods={};
	delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.SafeArray.Delegate.executeAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync]=OSF.DDA.SafeArray.Delegate.registerEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync]=OSF.DDA.SafeArray.Delegate.unregisterEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog]=OSF.DDA.SafeArray.Delegate.openDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog]=OSF.DDA.SafeArray.Delegate.closeDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent]=OSF.DDA.SafeArray.Delegate.messageParent;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.SendMessage]=OSF.DDA.SafeArray.Delegate.sendMessage;
	if (OSF.DDA.AsyncMethodNames.RefreshAsync && actionId==OSF.DDA.AsyncMethodNames.RefreshAsync.id) {
		var readSerializedSettings=function (hostCallArgs, onCalling, onReceiving) {
			return OSF.DDA.ClientSettingsManager.read(onCalling, onReceiving);
		};
		delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(readSerializedSettings);
	}
	if (OSF.DDA.AsyncMethodNames.SaveAsync && actionId==OSF.DDA.AsyncMethodNames.SaveAsync.id) {
		var writeSerializedSettings=function (hostCallArgs, onCalling, onReceiving) {
			return OSF.DDA.ClientSettingsManager.write(hostCallArgs[OSF.DDA.SettingsManager.SerializedSettings], hostCallArgs[Microsoft.Office.WebExtension.Parameters.OverwriteIfStale], onCalling, onReceiving);
		};
		delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(writeSerializedSettings);
	}
	return delegateMethods;
};
var OSF=OSF || {};
var OSFWebkit;
(function (OSFWebkit) {
	var WebkitSafeArray=(function () {
		function WebkitSafeArray(data) {
			this.data=data;
			this.safeArrayFlag=this.isSafeArray(data);
		}
		WebkitSafeArray.prototype.dimensions=function () {
			var dimensions=0;
			if (this.safeArrayFlag) {
				dimensions=this.data[0][0];
			}
			else if (this.isArray()) {
				dimensions=2;
			}
			return dimensions;
		};
		WebkitSafeArray.prototype.getItem=function () {
			var array=[];
			var element=null;
			if (this.safeArrayFlag) {
				array=this.toArray();
			}
			else {
				array=this.data;
			}
			element=array;
			for (var i=0; i < arguments.length; i++) {
				element=element[arguments[i]];
			}
			return element;
		};
		WebkitSafeArray.prototype.lbound=function (dimension) {
			return 0;
		};
		WebkitSafeArray.prototype.ubound=function (dimension) {
			var ubound=0;
			if (this.safeArrayFlag) {
				ubound=this.data[0][dimension];
			}
			else if (this.isArray()) {
				if (dimension==1) {
					return this.data.length;
				}
				else if (dimension==2) {
					if (OSF.OUtil.isArray(this.data[0])) {
						return this.data[0].length;
					}
					else if (this.data[0] !=null) {
						return 1;
					}
				}
			}
			return ubound;
		};
		WebkitSafeArray.prototype.toArray=function () {
			if (this.isArray()==false) {
				return this.data;
			}
			var arr=[];
			var startingIndex=this.safeArrayFlag ? 1 : 0;
			for (var i=startingIndex; i < this.data.length; i++) {
				var element=this.data[i];
				if (this.isSafeArray(element)) {
					arr.push(new WebkitSafeArray(element));
				}
				else {
					arr.push(element);
				}
			}
			return arr;
		};
		WebkitSafeArray.prototype.isArray=function () {
			return OSF.OUtil.isArray(this.data);
		};
		WebkitSafeArray.prototype.isSafeArray=function (obj) {
			var isSafeArray=false;
			if (OSF.OUtil.isArray(obj) && OSF.OUtil.isArray(obj[0])) {
				var bounds=obj[0];
				var dimensions=bounds[0];
				if (bounds.length !=dimensions+1) {
					return false;
				}
				var expectedArraySize=1;
				for (var i=1; i < bounds.length; i++) {
					var dimension=bounds[i];
					if (isFinite(dimension)==false) {
						return false;
					}
					expectedArraySize=expectedArraySize * dimension;
				}
				expectedArraySize++;
				isSafeArray=(expectedArraySize==obj.length);
			}
			return isSafeArray;
		};
		return WebkitSafeArray;
	})();
	OSFWebkit.WebkitSafeArray=WebkitSafeArray;
})(OSFWebkit || (OSFWebkit={}));
var OSFWebkit;
(function (OSFWebkit) {
	var ScriptMessaging;
	(function (ScriptMessaging) {
		var scriptMessenger=null;
		function agaveHostCallback(callbackId, params) {
			scriptMessenger.agaveHostCallback(callbackId, params);
		}
		ScriptMessaging.agaveHostCallback=agaveHostCallback;
		function agaveHostEventCallback(callbackId, params) {
			scriptMessenger.agaveHostEventCallback(callbackId, params);
		}
		ScriptMessaging.agaveHostEventCallback=agaveHostEventCallback;
		function GetScriptMessenger() {
			if (scriptMessenger==null) {
				scriptMessenger=new WebkitScriptMessaging("OSF.ScriptMessaging.agaveHostCallback", "OSF.ScriptMessaging.agaveHostEventCallback");
			}
			return scriptMessenger;
		}
		ScriptMessaging.GetScriptMessenger=GetScriptMessenger;
		var EventHandlerCallback=(function () {
			function EventHandlerCallback(id, targetId, handler) {
				this.id=id;
				this.targetId=targetId;
				this.handler=handler;
			}
			return EventHandlerCallback;
		})();
		var WebkitScriptMessaging=(function () {
			function WebkitScriptMessaging(methodCallbackName, eventCallbackName) {
				this.callingIndex=0;
				this.callbackList={};
				this.eventHandlerList={};
				this.asyncMethodCallbackFunctionName=methodCallbackName;
				this.eventCallbackFunctionName=eventCallbackName;
				this.conversationId=WebkitScriptMessaging.getCurrentTimeMS().toString();
			}
			WebkitScriptMessaging.prototype.invokeMethod=function (handlerName, methodId, params, callback) {
				var messagingArgs={};
				this.postWebkitMessage(messagingArgs, handlerName, methodId, params, callback);
			};
			WebkitScriptMessaging.prototype.registerEvent=function (handlerName, methodId, dispId, targetId, handler, callback) {
				var messagingArgs={
					eventCallbackFunction: this.eventCallbackFunctionName
				};
				var hostArgs={
					id: dispId,
					targetId: targetId
				};
				var correlationId=this.postWebkitMessage(messagingArgs, handlerName, methodId, hostArgs, callback);
				this.eventHandlerList[correlationId]=new EventHandlerCallback(dispId, targetId, handler);
			};
			WebkitScriptMessaging.prototype.unregisterEvent=function (handlerName, methodId, dispId, targetId, callback) {
				var hostArgs={
					id: dispId,
					targetId: targetId
				};
				for (var key in this.eventHandlerList) {
					if (this.eventHandlerList.hasOwnProperty(key)) {
						var eventCallback=this.eventHandlerList[key];
						if (eventCallback.id==dispId && eventCallback.targetId==targetId) {
							delete this.eventHandlerList[key];
						}
					}
				}
				this.invokeMethod(handlerName, methodId, hostArgs, callback);
			};
			WebkitScriptMessaging.prototype.agaveHostCallback=function (callbackId, params) {
				var callbackFunction=this.callbackList[callbackId];
				if (callbackFunction) {
					var callbacksDone=callbackFunction(params);
					if (callbacksDone===undefined || callbacksDone===true) {
						delete this.callbackList[callbackId];
					}
				}
			};
			WebkitScriptMessaging.prototype.agaveHostEventCallback=function (callbackId, params) {
				var eventCallback=this.eventHandlerList[callbackId];
				if (eventCallback) {
					eventCallback.handler(params);
				}
			};
			WebkitScriptMessaging.prototype.postWebkitMessage=function (messagingArgs, handlerName, methodId, params, callback) {
				var correlationId=this.generateCorrelationId();
				this.callbackList[correlationId]=callback;
				messagingArgs.methodId=methodId;
				messagingArgs.params=params;
				messagingArgs.callbackId=correlationId;
				messagingArgs.callbackFunction=this.asyncMethodCallbackFunctionName;
				var invokePostMessage=function () {
					window.webkit.messageHandlers[handlerName].postMessage(JSON.stringify(messagingArgs));
				};
				var currentTimestamp=WebkitScriptMessaging.getCurrentTimeMS();
				if (this.lastMessageTimestamp==null || (currentTimestamp - this.lastMessageTimestamp >=WebkitScriptMessaging.MESSAGE_TIME_DELTA)) {
					invokePostMessage();
					this.lastMessageTimestamp=currentTimestamp;
				}
				else {
					this.lastMessageTimestamp+=WebkitScriptMessaging.MESSAGE_TIME_DELTA;
					setTimeout(function () {
						invokePostMessage();
					}, this.lastMessageTimestamp - currentTimestamp);
				}
				return correlationId;
			};
			WebkitScriptMessaging.prototype.generateCorrelationId=function () {
++this.callingIndex;
				return this.conversationId+this.callingIndex;
			};
			WebkitScriptMessaging.getCurrentTimeMS=function () {
				return (new Date).getTime();
			};
			WebkitScriptMessaging.MESSAGE_TIME_DELTA=10;
			return WebkitScriptMessaging;
		})();
		ScriptMessaging.WebkitScriptMessaging=WebkitScriptMessaging;
	})(ScriptMessaging=OSFWebkit.ScriptMessaging || (OSFWebkit.ScriptMessaging={}));
})(OSFWebkit || (OSFWebkit={}));
OSF.ScriptMessaging=OSFWebkit.ScriptMessaging;
var OSFWebkit;
(function (OSFWebkit) {
	OSFWebkit.MessageHandlerName="Agave";
	OSFWebkit.PopupMessageHandlerName="WefPopupHandler";
	(function (AppContextProperties) {
		AppContextProperties[AppContextProperties["Settings"]=0]="Settings";
		AppContextProperties[AppContextProperties["SolutionReferenceId"]=1]="SolutionReferenceId";
		AppContextProperties[AppContextProperties["AppType"]=2]="AppType";
		AppContextProperties[AppContextProperties["MajorVersion"]=3]="MajorVersion";
		AppContextProperties[AppContextProperties["MinorVersion"]=4]="MinorVersion";
		AppContextProperties[AppContextProperties["RevisionVersion"]=5]="RevisionVersion";
		AppContextProperties[AppContextProperties["APIVersionSequence"]=6]="APIVersionSequence";
		AppContextProperties[AppContextProperties["AppCapabilities"]=7]="AppCapabilities";
		AppContextProperties[AppContextProperties["APPUILocale"]=8]="APPUILocale";
		AppContextProperties[AppContextProperties["AppDataLocale"]=9]="AppDataLocale";
		AppContextProperties[AppContextProperties["BindingCount"]=10]="BindingCount";
		AppContextProperties[AppContextProperties["DocumentUrl"]=11]="DocumentUrl";
		AppContextProperties[AppContextProperties["ActivationMode"]=12]="ActivationMode";
		AppContextProperties[AppContextProperties["ControlIntegrationLevel"]=13]="ControlIntegrationLevel";
		AppContextProperties[AppContextProperties["SolutionToken"]=14]="SolutionToken";
		AppContextProperties[AppContextProperties["APISetVersion"]=15]="APISetVersion";
		AppContextProperties[AppContextProperties["CorrelationId"]=16]="CorrelationId";
		AppContextProperties[AppContextProperties["InstanceId"]=17]="InstanceId";
		AppContextProperties[AppContextProperties["TouchEnabled"]=18]="TouchEnabled";
		AppContextProperties[AppContextProperties["CommerceAllowed"]=19]="CommerceAllowed";
		AppContextProperties[AppContextProperties["RequirementMatrix"]=20]="RequirementMatrix";
		AppContextProperties[AppContextProperties["HostCustomMessage"]=21]="HostCustomMessage";
		AppContextProperties[AppContextProperties["HostFullVersion"]=22]="HostFullVersion";
	})(OSFWebkit.AppContextProperties || (OSFWebkit.AppContextProperties={}));
	var AppContextProperties=OSFWebkit.AppContextProperties;
	(function (MethodId) {
		MethodId[MethodId["Execute"]=1]="Execute";
		MethodId[MethodId["RegisterEvent"]=2]="RegisterEvent";
		MethodId[MethodId["UnregisterEvent"]=3]="UnregisterEvent";
		MethodId[MethodId["WriteSettings"]=4]="WriteSettings";
		MethodId[MethodId["GetContext"]=5]="GetContext";
	})(OSFWebkit.MethodId || (OSFWebkit.MethodId={}));
	var MethodId=OSFWebkit.MethodId;
	var WebkitHostController=(function () {
		function WebkitHostController(hostScriptProxy) {
			this.hostScriptProxy=hostScriptProxy;
		}
		WebkitHostController.prototype.execute=function (id, params, callback) {
			var args=params;
			if (args==null) {
				args=[];
			}
			var hostParams={
				id: id,
				apiArgs: args
			};
			var agaveResponseCallback=function (payload) {
				if (callback) {
					var invokeArguments=[];
					if (OSF.OUtil.isArray(payload)) {
						for (var i=0; i < payload.length; i++) {
							var element=payload[i];
							if (OSF.OUtil.isArray(element)) {
								element=new OSFWebkit.WebkitSafeArray(element);
							}
							invokeArguments.unshift(element);
						}
					}
					return callback.apply(null, invokeArguments);
				}
			};
			this.hostScriptProxy.invokeMethod(OSF.Webkit.MessageHandlerName, OSF.Webkit.MethodId.Execute, hostParams, agaveResponseCallback);
		};
		WebkitHostController.prototype.registerEvent=function (id, targetId, handler, callback) {
			var agaveEventHandlerCallback=function (payload) {
				var safeArraySource=payload;
				var eventId=0;
				if (OSF.OUtil.isArray(payload) && payload.length >=2) {
					safeArraySource=payload[0];
					eventId=payload[1];
				}
				if (handler) {
					handler(eventId, new OSFWebkit.WebkitSafeArray(safeArraySource));
				}
			};
			var agaveResponseCallback=function (payload) {
				if (callback) {
					return callback(new OSFWebkit.WebkitSafeArray(payload));
				}
			};
			this.hostScriptProxy.registerEvent(OSF.Webkit.MessageHandlerName, OSF.Webkit.MethodId.RegisterEvent, id, targetId, agaveEventHandlerCallback, agaveResponseCallback);
		};
		WebkitHostController.prototype.unregisterEvent=function (id, targetId, callback) {
			var agaveResponseCallback=function (response) {
				return callback(new OSFWebkit.WebkitSafeArray(response));
			};
			this.hostScriptProxy.unregisterEvent(OSF.Webkit.MessageHandlerName, OSF.Webkit.MethodId.UnregisterEvent, id, targetId, agaveResponseCallback);
		};
		WebkitHostController.prototype.messageParent=function (params) {
			var message=params[Microsoft.Office.WebExtension.Parameters.MessageToParent];
			var messageObj={ dialogMessage: { messageType: OSF.DialogMessageType.DialogMessageReceived, messageContent: message } };
			window.opener.postMessage(JSON.stringify(messageObj), window.location.origin);
		};
		WebkitHostController.prototype.openDialog=function (id, targetId, handler, callback) {
			if (WebkitHostController.popup && !WebkitHostController.popup.closed) {
				callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened);
				return;
			}
			var magicWord="action=displayDialog";
			WebkitHostController.OpenDialogCallback=undefined;
			var fragmentSeparator='#';
			var callArgs=JSON.parse(targetId);
			var callUrl=callArgs.url;
			if (!callUrl) {
				return;
			}
			var urlParts=callUrl.split(fragmentSeparator);
			var seperator="?";
			if (urlParts[0].indexOf("?") > -1) {
				seperator="&";
			}
			var width=screen.width * callArgs.width / 100;
			var height=screen.height * callArgs.height / 100;
			var params="width="+width+", height="+height;
			urlParts[0]=urlParts[0].concat(seperator).concat(magicWord);
			var openUrl=urlParts.join(fragmentSeparator);
			WebkitHostController.popup=window.open(openUrl, "", params);
			function receiveMessage(event) {
				if (event.origin==window.location.origin) {
					try {
						var messageObj=JSON.parse(event.data);
						if (messageObj.dialogMessage) {
							handler(id, [OSF.DialogMessageType.DialogMessageReceived, messageObj.dialogMessage.messageContent]);
						}
					}
					catch (e) {
						OsfMsAjaxFactory.msAjaxDebug.trace("messages received cannot be handlered. Message:"+event.data);
					}
				}
			}
			function checkWindowClose() {
				try {
					if (WebkitHostController.popup==null || WebkitHostController.popup.closed) {
						window.clearInterval(WebkitHostController.interval);
						window.removeEventListener("message", receiveMessage);
						WebkitHostController.NotifyError=null;
						WebkitHostController.popup=null;
						handler(id, [OSF.DialogMessageType.DialogClosed]);
					}
				}
				catch (e) {
					OsfMsAjaxFactory.msAjaxDebug.trace("Error happened when popup window closed.");
				}
			}
			WebkitHostController.OpenDialogCallback=function (code) {
				if (code==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					window.addEventListener("message", receiveMessage);
					this.messageEventListener=receiveMessage;
					WebkitHostController.interval=window.setInterval(checkWindowClose, 1000);
					function notifyError(errorCode) {
						handler(id, [errorCode]);
					}
					WebkitHostController.NotifyError=notifyError;
				}
				callback(code);
			};
		};
		WebkitHostController.prototype.closeDialog=function (id, targetId, callback) {
			if (WebkitHostController.popup) {
				if (WebkitHostController.interval) {
					window.clearInterval(WebkitHostController.interval);
				}
				WebkitHostController.popup.close();
				WebkitHostController.popup=null;
				window.removeEventListener("message", this.messageEventListener);
				WebkitHostController.NotifyError=null;
				callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
			}
			else {
				callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
			}
		};
		WebkitHostController.prototype.sendMessage=function (params) {
		};
		return WebkitHostController;
	})();
	OSFWebkit.WebkitHostController=WebkitHostController;
})(OSFWebkit || (OSFWebkit={}));
OSF.Webkit=OSFWebkit;
OSF.ClientHostController=new OSFWebkit.WebkitHostController(OSF.ScriptMessaging.GetScriptMessenger());
OSF.DDA.ClientSettingsManager={
	getSettingsExecuteMethod: function OSF_DDA_ClientSettingsManager$getSettingsExecuteMethod(hostDelegateMethod) {
		return function (args) {
			var status, response;
			var onComplete=function onComplete(status, response) {
				if (args.onReceiving) {
					args.onReceiving();
				}
				if (args.onComplete) {
					args.onComplete(status, response);
				}
			};
			try {
				hostDelegateMethod(args.hostCallArgs, args.onCalling, onComplete);
			}
			catch (ex) {
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				response={ name: Strings.OfficeOM.L_InternalError, message: ex };
				onComplete(status, response);
			}
		};
	},
	read: function OSF_DDA_ClientSettingsManager$read(onCalling, onComplete) {
		var keys=[];
		var values=[];
		if (onCalling) {
			onCalling();
		}
		var initializationHelper=OSF._OfficeAppFactory.getInitializationHelper();
		var onReceivedContext=function onReceivedContext(appContext) {
			if (onComplete) {
				onComplete(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess, appContext.get_settings());
			}
		};
		initializationHelper.getAppContext(null, onReceivedContext);
	},
	write: function OSF_DDA_ClientSettingsManager$write(serializedSettings, overwriteIfStale, onCalling, onComplete) {
		var hostParams={};
		var keys=[];
		var values=[];
		for (var key in serializedSettings) {
			keys.push(key);
			values.push(serializedSettings[key]);
		}
		hostParams["keys"]=keys;
		hostParams["values"]=values;
		if (onCalling) {
			onCalling();
		}
		var onWriteCompleted=function onWriteCompleted(status) {
			if (onComplete) {
				onComplete(status[0], null);
			}
		};
		OSF.ScriptMessaging.GetScriptMessenger().invokeMethod(OSF.Webkit.MessageHandlerName, OSF.Webkit.MethodId.WriteSettings, hostParams, onWriteCompleted);
	}
};
OSF.InitializationHelper.prototype.initializeSettings=function OSF_InitializationHelper$initializeSettings(appContext, refreshSupported) {
	var serializedSettings=appContext.get_settings();
	var settings=this.deserializeSettings(serializedSettings, refreshSupported);
	return settings;
};
OSF.InitializationHelper.prototype.getAppContext=function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
	var getInvocationCallback=function OSF_InitializationHelper_getAppContextAsync$getInvocationCallbackWebApp(appContext) {
		var returnedContext;
		var appContextProperties=OSF.Webkit.AppContextProperties;
		var appType=appContext[appContextProperties.AppType];
		var hostSettings=appContext[appContextProperties.Settings];
		var serializedSettings={};
		var keys=hostSettings[0];
		var values=hostSettings[1];
		for (var index=0; index < keys.length; index++) {
			serializedSettings[keys[index]]=values[index];
		}
		var id=appContext[appContextProperties.SolutionReferenceId];
		var version=appContext[appContextProperties.MajorVersion];
		var minorVersion=appContext[appContextProperties.MinorVersion];
		var clientMode=appContext[appContextProperties.AppCapabilities];
		var UILocale=appContext[appContextProperties.APPUILocale];
		var dataLocale=appContext[appContextProperties.AppDataLocale];
		var docUrl=appContext[appContextProperties.DocumentUrl];
		var reason=appContext[appContextProperties.ActivationMode];
		var osfControlType=appContext[appContextProperties.ControlIntegrationLevel];
		var eToken=appContext[appContextProperties.SolutionToken];
		eToken=eToken ? eToken.toString() : "";
		var correlationId=appContext[appContextProperties.CorrelationId];
		var appInstanceId=appContext[appContextProperties.InstanceId];
		var touchEnabled=appContext[appContextProperties.TouchEnabled];
		var commerceAllowed=appContext[appContextProperties.CommerceAllowed];
		var requirementMatrix=appContext[appContextProperties.RequirementMatrix];
		var hostCustomMessage=appContext[appContextProperties.HostCustomMessage];
		var hostFullVersion=appContext[appContextProperties.HostFullVersion];
		returnedContext=new OSF.OfficeAppContext(id, appType, version, UILocale, dataLocale, docUrl, clientMode, serializedSettings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, minorVersion, requirementMatrix, hostCustomMessage, hostFullVersion);
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.initialize(returnedContext);
		}
		gotAppContext(returnedContext);
	};
	var handler;
	if (this._hostInfo.isDialog) {
		handler=OSF.Webkit.PopupMessageHandlerName;
	}
	else {
		handler=OSF.Webkit.MessageHandlerName;
	}
	OSF.ScriptMessaging.GetScriptMessenger().invokeMethod(handler, OSF.Webkit.MethodId.GetContext, [], getInvocationCallback);
};
var OSFLog;
(function (OSFLog) {
	var BaseUsageData=(function () {
		function BaseUsageData(table) {
			this._table=table;
			this._fields={};
		}
		Object.defineProperty(BaseUsageData.prototype, "Fields", {
			get: function () {
				return this._fields;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BaseUsageData.prototype, "Table", {
			get: function () {
				return this._table;
			},
			enumerable: true,
			configurable: true
		});
		BaseUsageData.prototype.SerializeFields=function () {
		};
		BaseUsageData.prototype.SetSerializedField=function (key, value) {
			if (typeof (value) !=="undefined" && value !==null) {
				this._serializedFields[key]=value.toString();
			}
		};
		BaseUsageData.prototype.SerializeRow=function () {
			this._serializedFields={};
			this.SetSerializedField("Table", this._table);
			this.SerializeFields();
			return JSON.stringify(this._serializedFields);
		};
		return BaseUsageData;
	})();
	OSFLog.BaseUsageData=BaseUsageData;
	var AppActivatedUsageData=(function (_super) {
		__extends(AppActivatedUsageData, _super);
		function AppActivatedUsageData() {
			_super.call(this, "AppActivated");
		}
		Object.defineProperty(AppActivatedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppId", {
			get: function () { return this.Fields["AppId"]; },
			set: function (value) { this.Fields["AppId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppInstanceId", {
			get: function () { return this.Fields["AppInstanceId"]; },
			set: function (value) { this.Fields["AppInstanceId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppURL", {
			get: function () { return this.Fields["AppURL"]; },
			set: function (value) { this.Fields["AppURL"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AssetId", {
			get: function () { return this.Fields["AssetId"]; },
			set: function (value) { this.Fields["AssetId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Browser", {
			get: function () { return this.Fields["Browser"]; },
			set: function (value) { this.Fields["Browser"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "UserId", {
			get: function () { return this.Fields["UserId"]; },
			set: function (value) { this.Fields["UserId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Host", {
			get: function () { return this.Fields["Host"]; },
			set: function (value) { this.Fields["Host"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostVersion", {
			get: function () { return this.Fields["HostVersion"]; },
			set: function (value) { this.Fields["HostVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "ClientId", {
			get: function () { return this.Fields["ClientId"]; },
			set: function (value) { this.Fields["ClientId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeWidth", {
			get: function () { return this.Fields["AppSizeWidth"]; },
			set: function (value) { this.Fields["AppSizeWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeHeight", {
			get: function () { return this.Fields["AppSizeHeight"]; },
			set: function (value) { this.Fields["AppSizeHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "DocUrl", {
			get: function () { return this.Fields["DocUrl"]; },
			set: function (value) { this.Fields["DocUrl"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "OfficeJSVersion", {
			get: function () { return this.Fields["OfficeJSVersion"]; },
			set: function (value) { this.Fields["OfficeJSVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostJSVersion", {
			get: function () { return this.Fields["HostJSVersion"]; },
			set: function (value) { this.Fields["HostJSVersion"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "WacHostEnvironment", {
			get: function () { return this.Fields["WacHostEnvironment"]; },
			set: function (value) { this.Fields["WacHostEnvironment"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "IsFromWacAutomation", {
			get: function () { return this.Fields["IsFromWacAutomation"]; },
			set: function (value) { this.Fields["IsFromWacAutomation"]=value; },
			enumerable: true,
			configurable: true
		});
		AppActivatedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("AppId", this.AppId);
			this.SetSerializedField("AppInstanceId", this.AppInstanceId);
			this.SetSerializedField("AppURL", this.AppURL);
			this.SetSerializedField("AssetId", this.AssetId);
			this.SetSerializedField("Browser", this.Browser);
			this.SetSerializedField("UserId", this.UserId);
			this.SetSerializedField("Host", this.Host);
			this.SetSerializedField("HostVersion", this.HostVersion);
			this.SetSerializedField("ClientId", this.ClientId);
			this.SetSerializedField("AppSizeWidth", this.AppSizeWidth);
			this.SetSerializedField("AppSizeHeight", this.AppSizeHeight);
			this.SetSerializedField("Message", this.Message);
			this.SetSerializedField("DocUrl", this.DocUrl);
			this.SetSerializedField("OfficeJSVersion", this.OfficeJSVersion);
			this.SetSerializedField("HostJSVersion", this.HostJSVersion);
			this.SetSerializedField("WacHostEnvironment", this.WacHostEnvironment);
			this.SetSerializedField("IsFromWacAutomation", this.IsFromWacAutomation);
		};
		return AppActivatedUsageData;
	})(BaseUsageData);
	OSFLog.AppActivatedUsageData=AppActivatedUsageData;
	var ScriptLoadUsageData=(function (_super) {
		__extends(ScriptLoadUsageData, _super);
		function ScriptLoadUsageData() {
			_super.call(this, "ScriptLoad");
		}
		Object.defineProperty(ScriptLoadUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ScriptId", {
			get: function () { return this.Fields["ScriptId"]; },
			set: function (value) { this.Fields["ScriptId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "StartTime", {
			get: function () { return this.Fields["StartTime"]; },
			set: function (value) { this.Fields["StartTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		ScriptLoadUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("ScriptId", this.ScriptId);
			this.SetSerializedField("StartTime", this.StartTime);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
		};
		return ScriptLoadUsageData;
	})(BaseUsageData);
	OSFLog.ScriptLoadUsageData=ScriptLoadUsageData;
	var AppClosedUsageData=(function (_super) {
		__extends(AppClosedUsageData, _super);
		function AppClosedUsageData() {
			_super.call(this, "AppClosed");
		}
		Object.defineProperty(AppClosedUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "FocusTime", {
			get: function () { return this.Fields["FocusTime"]; },
			set: function (value) { this.Fields["FocusTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalWidth", {
			get: function () { return this.Fields["AppSizeFinalWidth"]; },
			set: function (value) { this.Fields["AppSizeFinalWidth"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalHeight", {
			get: function () { return this.Fields["AppSizeFinalHeight"]; },
			set: function (value) { this.Fields["AppSizeFinalHeight"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "OpenTime", {
			get: function () { return this.Fields["OpenTime"]; },
			set: function (value) { this.Fields["OpenTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "CloseMethod", {
			get: function () { return this.Fields["CloseMethod"]; },
			set: function (value) { this.Fields["CloseMethod"]=value; },
			enumerable: true,
			configurable: true
		});
		AppClosedUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("FocusTime", this.FocusTime);
			this.SetSerializedField("AppSizeFinalWidth", this.AppSizeFinalWidth);
			this.SetSerializedField("AppSizeFinalHeight", this.AppSizeFinalHeight);
			this.SetSerializedField("OpenTime", this.OpenTime);
			this.SetSerializedField("CloseMethod", this.CloseMethod);
		};
		return AppClosedUsageData;
	})(BaseUsageData);
	OSFLog.AppClosedUsageData=AppClosedUsageData;
	var APIUsageUsageData=(function (_super) {
		__extends(APIUsageUsageData, _super);
		function APIUsageUsageData() {
			_super.call(this, "APIUsage");
		}
		Object.defineProperty(APIUsageUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIType", {
			get: function () { return this.Fields["APIType"]; },
			set: function (value) { this.Fields["APIType"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIID", {
			get: function () { return this.Fields["APIID"]; },
			set: function (value) { this.Fields["APIID"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "Parameters", {
			get: function () { return this.Fields["Parameters"]; },
			set: function (value) { this.Fields["Parameters"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ResponseTime", {
			get: function () { return this.Fields["ResponseTime"]; },
			set: function (value) { this.Fields["ResponseTime"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ErrorType", {
			get: function () { return this.Fields["ErrorType"]; },
			set: function (value) { this.Fields["ErrorType"]=value; },
			enumerable: true,
			configurable: true
		});
		APIUsageUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("APIType", this.APIType);
			this.SetSerializedField("APIID", this.APIID);
			this.SetSerializedField("Parameters", this.Parameters);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
			this.SetSerializedField("ErrorType", this.ErrorType);
		};
		return APIUsageUsageData;
	})(BaseUsageData);
	OSFLog.APIUsageUsageData=APIUsageUsageData;
	var AppInitializationUsageData=(function (_super) {
		__extends(AppInitializationUsageData, _super);
		function AppInitializationUsageData() {
			_super.call(this, "AppInitialization");
		}
		Object.defineProperty(AppInitializationUsageData.prototype, "CorrelationId", {
			get: function () { return this.Fields["CorrelationId"]; },
			set: function (value) { this.Fields["CorrelationId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SessionId", {
			get: function () { return this.Fields["SessionId"]; },
			set: function (value) { this.Fields["SessionId"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SuccessCode", {
			get: function () { return this.Fields["SuccessCode"]; },
			set: function (value) { this.Fields["SuccessCode"]=value; },
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "Message", {
			get: function () { return this.Fields["Message"]; },
			set: function (value) { this.Fields["Message"]=value; },
			enumerable: true,
			configurable: true
		});
		AppInitializationUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("SuccessCode", this.SuccessCode);
			this.SetSerializedField("Message", this.Message);
		};
		return AppInitializationUsageData;
	})(BaseUsageData);
	OSFLog.AppInitializationUsageData=AppInitializationUsageData;
})(OSFLog || (OSFLog={}));
var Logger;
(function (Logger) {
	"use strict";
	(function (TraceLevel) {
		TraceLevel[TraceLevel["info"]=0]="info";
		TraceLevel[TraceLevel["warning"]=1]="warning";
		TraceLevel[TraceLevel["error"]=2]="error";
	})(Logger.TraceLevel || (Logger.TraceLevel={}));
	var TraceLevel=Logger.TraceLevel;
	(function (SendFlag) {
		SendFlag[SendFlag["none"]=0]="none";
		SendFlag[SendFlag["flush"]=1]="flush";
	})(Logger.SendFlag || (Logger.SendFlag={}));
	var SendFlag=Logger.SendFlag;
	function allowUploadingData() {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			OSF.Logger.ulsEndpoint.loadProxyFrame();
		}
	}
	Logger.allowUploadingData=allowUploadingData;
	function sendLog(traceLevel, message, flag) {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			var jsonObj={ traceLevel: traceLevel, message: message, flag: flag, internalLog: true };
			var logs=JSON.stringify(jsonObj);
			OSF.Logger.ulsEndpoint.writeLog(logs);
		}
	}
	Logger.sendLog=sendLog;
	function creatULSEndpoint() {
		try {
			return new ULSEndpointProxy();
		}
		catch (e) {
			return null;
		}
	}
	var ULSEndpointProxy=(function () {
		function ULSEndpointProxy() {
			var _this=this;
			this.proxyFrame=null;
			this.telemetryEndPoint="https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
			this.buffer=[];
			this.proxyFrameReady=false;
			OSF.OUtil.addEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			setTimeout(function () {
				_this.loadProxyFrame();
			}, 3000);
		}
		ULSEndpointProxy.prototype.writeLog=function (log) {
			if (this.proxyFrameReady===true) {
				this.proxyFrame.contentWindow.postMessage(log, ULSEndpointProxy.telemetryOrigin);
			}
			else {
				if (this.buffer.length < 128) {
					this.buffer.push(log);
				}
			}
		};
		ULSEndpointProxy.prototype.loadProxyFrame=function () {
			if (this.proxyFrame==null) {
				this.proxyFrame=document.createElement("iframe");
				this.proxyFrame.setAttribute("style", "display:none");
				this.proxyFrame.setAttribute("src", this.telemetryEndPoint);
				document.head.appendChild(this.proxyFrame);
			}
		};
		ULSEndpointProxy.prototype.tellProxyFrameReady=function (e) {
			var _this=this;
			if (e.data==="ProxyFrameReadyToLog") {
				this.proxyFrameReady=true;
				for (var i=0; i < this.buffer.length; i++) {
					this.writeLog(this.buffer[i]);
				}
				this.buffer.length=0;
				OSF.OUtil.removeEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
			}
			else if (e.data==="ProxyFrameReadyToInit") {
				var initJson={ appName: "Office APPs", sessionId: OSF.OUtil.Guid.generateNewGuid() };
				var initStr=JSON.stringify(initJson);
				this.proxyFrame.contentWindow.postMessage(initStr, ULSEndpointProxy.telemetryOrigin);
			}
		};
		ULSEndpointProxy.telemetryOrigin="https://telemetryservice.firstpartyapps.oaspapps.com";
		return ULSEndpointProxy;
	})();
	if (!OSF.Logger) {
		OSF.Logger=Logger;
	}
	Logger.ulsEndpoint=creatULSEndpoint();
})(Logger || (Logger={}));
var OSFAriaLogger;
(function (OSFAriaLogger) {
	var AriaLogger=(function () {
		function AriaLogger() {
		}
		AriaLogger.prototype.getAriaCDNLocation=function () {
			return (OSF._OfficeAppFactory.getLoadScriptHelper().getOfficeJsBasePath()+"/ariatelemetry/aria-web-telemetry-2.8.0.min.js");
		};
		AriaLogger.getInstance=function () {
			if (AriaLogger.AriaLoggerObj===undefined) {
				AriaLogger.AriaLoggerObj=new AriaLogger();
			}
			return AriaLogger.AriaLoggerObj;
		};
		AriaLogger.prototype.isIUsageData=function (arg) {
			return arg["Fields"] !==undefined;
		};
		AriaLogger.prototype.loadAriaScriptAndLog=function (tableName, telemetryData) {
			var startAfterMs=1000;
			OSF.OUtil.loadScript(this.getAriaCDNLocation(), function () {
				try {
					if (!this.ALogger) {
						var OfficeExtensibilityTenantID="db334b301e7b474db5e0f02f07c51a47-a1b5bc36-1bbe-482f-a64a-c2d9cb606706-7439";
						var configuration=new microsoft.applications.telemetry.LogConfiguration();
						configuration.enableAutoUserSession=true;
						microsoft.applications.telemetry.LogManager.initialize(OfficeExtensibilityTenantID, configuration);
						this.ALogger=new microsoft.applications.telemetry.Logger();
					}
					var eventProperties=new microsoft.applications.telemetry.EventProperties();
					eventProperties.name="Office.Extensibility.OfficeJS."+tableName;
					for (var key in telemetryData) {
						if (key.toLowerCase() !=="table") {
							eventProperties.setProperty(key, telemetryData[key]);
						}
					}
					var today=new Date();
					eventProperties.setProperty("Date", today.toISOString());
					this.ALogger.logEvent(eventProperties);
				}
				catch (e) {
				}
			}, startAfterMs);
		};
		AriaLogger.prototype.logData=function (data) {
			if (this.isIUsageData(data)) {
				this.loadAriaScriptAndLog(data["Table"], data["Fields"]);
			}
			else {
				this.loadAriaScriptAndLog(data["Table"], data);
			}
		};
		return AriaLogger;
	})();
	OSFAriaLogger.AriaLogger=AriaLogger;
})(OSFAriaLogger || (OSFAriaLogger={}));
var OSFAppTelemetry;
(function (OSFAppTelemetry) {
	"use strict";
	var appInfo;
	var sessionId=OSF.OUtil.Guid.generateNewGuid();
	var osfControlAppCorrelationId="";
	var omexDomainRegex=new RegExp("^https?://store\\.office(ppe|-int)?\\.com/", "i");
	;
	var AppInfo=(function () {
		function AppInfo() {
		}
		return AppInfo;
	})();
	var Event=(function () {
		function Event(name, handler) {
			this.name=name;
			this.handler=handler;
		}
		return Event;
	})();
	var AppStorage=(function () {
		function AppStorage() {
			this.clientIDKey="Office API client";
			this.logIdSetKey="Office App Log Id Set";
		}
		AppStorage.prototype.getClientId=function () {
			var clientId=this.getValue(this.clientIDKey);
			if (!clientId || clientId.length <=0 || clientId.length > 40) {
				clientId=OSF.OUtil.Guid.generateNewGuid();
				this.setValue(this.clientIDKey, clientId);
			}
			return clientId;
		};
		AppStorage.prototype.saveLog=function (logId, log) {
			var logIdSet=this.getValue(this.logIdSetKey);
			logIdSet=((logIdSet && logIdSet.length > 0) ? (logIdSet+";") : "")+logId;
			this.setValue(this.logIdSetKey, logIdSet);
			this.setValue(logId, log);
		};
		AppStorage.prototype.enumerateLog=function (callback, clean) {
			var logIdSet=this.getValue(this.logIdSetKey);
			if (logIdSet) {
				var ids=logIdSet.split(";");
				for (var id in ids) {
					var logId=ids[id];
					var log=this.getValue(logId);
					if (log) {
						if (callback) {
							callback(logId, log);
						}
						if (clean) {
							this.remove(logId);
						}
					}
				}
				if (clean) {
					this.remove(this.logIdSetKey);
				}
			}
		};
		AppStorage.prototype.getValue=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			var value="";
			if (osfLocalStorage) {
				value=osfLocalStorage.getItem(key);
			}
			return value;
		};
		AppStorage.prototype.setValue=function (key, value) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				osfLocalStorage.setItem(key, value);
			}
		};
		AppStorage.prototype.remove=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				try {
					osfLocalStorage.removeItem(key);
				}
				catch (ex) {
				}
			}
		};
		return AppStorage;
	})();
	var AppLogger=(function () {
		function AppLogger() {
		}
		AppLogger.prototype.LogData=function (data) {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, data.SerializeRow(), OSF.Logger.SendFlag.none);
			OSFAriaLogger.AriaLogger.getInstance().logData(data);
		};
		AppLogger.prototype.LogRawData=function (log) {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, log, OSF.Logger.SendFlag.none);
			try {
				OSFAriaLogger.AriaLogger.getInstance().logData(JSON.parse(log));
			}
			catch (e) {
			}
		};
		return AppLogger;
	})();
	function trimStringToLowerCase(input) {
		if (input) {
			input=input.replace(/[{}]/g, "").toLowerCase();
		}
		return (input || "");
	}
	function initialize(context) {
		if (!OSF.Logger) {
			return;
		}
		if (appInfo) {
			return;
		}
		appInfo=new AppInfo();
		if (context.get_hostFullVersion()) {
			appInfo.hostVersion=context.get_hostFullVersion();
		}
		else {
			appInfo.hostVersion=context.get_appVersion();
		}
		appInfo.appId=context.get_id();
		appInfo.host=context.get_appName();
		appInfo.browser=window.navigator.userAgent;
		appInfo.correlationId=trimStringToLowerCase(context.get_correlationId());
		appInfo.clientId=(new AppStorage()).getClientId();
		appInfo.appInstanceId=context.get_appInstanceId();
		if (appInfo.appInstanceId) {
			appInfo.appInstanceId=appInfo.appInstanceId.replace(/[{}]/g, "").toLowerCase();
		}
		appInfo.message=context.get_hostCustomMessage();
		appInfo.officeJSVersion=OSF.ConstantNames.FileVersion;
		appInfo.hostJSVersion="16.0.8118.1000";
		if (context._wacHostEnvironment) {
			appInfo.wacHostEnvironment=context._wacHostEnvironment;
		}
		if (context._isFromWacAutomation !==undefined && context._isFromWacAutomation !==null) {
			appInfo.isFromWacAutomation=context._isFromWacAutomation.toString().toLowerCase();
		}
		var docUrl=context.get_docUrl();
		appInfo.docUrl=omexDomainRegex.test(docUrl) ? docUrl : "";
		var url=location.href;
		if (url) {
			url=url.split("?")[0].split("#")[0];
		}
		appInfo.appURL=url;
		(function getUserIdAndAssetIdFromToken(token, appInfo) {
			var xmlContent;
			var parser;
			var xmlDoc;
			appInfo.assetId="";
			appInfo.userId="";
			try {
				xmlContent=decodeURIComponent(token);
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(xmlContent, "text/xml");
				var cidNode=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid");
				var oidNode=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("oid");
				if (cidNode && cidNode.nodeValue) {
					appInfo.userId=cidNode.nodeValue;
				}
				else if (oidNode && oidNode.nodeValue) {
					appInfo.userId=oidNode.nodeValue;
				}
				appInfo.assetId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue;
			}
			catch (e) {
			}
			finally {
				xmlContent=null;
				xmlDoc=null;
				parser=null;
			}
		})(context.get_eToken(), appInfo);
		(function handleLifecycle() {
			var startTime=new Date();
			var lastFocus=null;
			var focusTime=0;
			var finished=false;
			var adjustFocusTime=function () {
				if (document.hasFocus()) {
					if (lastFocus==null) {
						lastFocus=new Date();
					}
				}
				else if (lastFocus) {
					focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
					lastFocus=null;
				}
			};
			var eventList=[];
			eventList.push(new Event("focus", adjustFocusTime));
			eventList.push(new Event("blur", adjustFocusTime));
			eventList.push(new Event("focusout", adjustFocusTime));
			eventList.push(new Event("focusin", adjustFocusTime));
			var exitFunction=function () {
				for (var i=0; i < eventList.length; i++) {
					OSF.OUtil.removeEventListener(window, eventList[i].name, eventList[i].handler);
				}
				eventList.length=0;
				if (!finished) {
					if (document.hasFocus() && lastFocus) {
						focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
						lastFocus=null;
					}
					OSFAppTelemetry.onAppClosed(Math.abs((new Date()).getTime() - startTime.getTime()), focusTime);
					finished=true;
				}
			};
			eventList.push(new Event("beforeunload", exitFunction));
			eventList.push(new Event("unload", exitFunction));
			for (var i=0; i < eventList.length; i++) {
				OSF.OUtil.addEventListener(window, eventList[i].name, eventList[i].handler);
			}
			adjustFocusTime();
		})();
		OSFAppTelemetry.onAppActivated();
	}
	OSFAppTelemetry.initialize=initialize;
	function onAppActivated() {
		if (!appInfo) {
			return;
		}
		(new AppStorage()).enumerateLog(function (id, log) { return (new AppLogger()).LogRawData(log); }, true);
		var data=new OSFLog.AppActivatedUsageData();
		data.SessionId=sessionId;
		data.AppId=appInfo.appId;
		data.AssetId=appInfo.assetId;
		data.AppURL=appInfo.appURL;
		data.UserId=appInfo.userId;
		data.ClientId=appInfo.clientId;
		data.Browser=appInfo.browser;
		data.Host=appInfo.host;
		data.HostVersion=appInfo.hostVersion;
		data.CorrelationId=trimStringToLowerCase(appInfo.correlationId);
		data.AppSizeWidth=window.innerWidth;
		data.AppSizeHeight=window.innerHeight;
		data.AppInstanceId=appInfo.appInstanceId;
		data.Message=appInfo.message;
		data.DocUrl=appInfo.docUrl;
		data.OfficeJSVersion=appInfo.officeJSVersion;
		data.HostJSVersion=appInfo.hostJSVersion;
		if (appInfo.wacHostEnvironment) {
			data.WacHostEnvironment=appInfo.wacHostEnvironment;
		}
		if (appInfo.isFromWacAutomation !==undefined && appInfo.isFromWacAutomation !==null) {
			data.IsFromWacAutomation=appInfo.isFromWacAutomation;
		}
		(new AppLogger()).LogData(data);
		setTimeout(function () {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.allowUploadingData();
		}, 100);
	}
	OSFAppTelemetry.onAppActivated=onAppActivated;
	function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId) {
		var data=new OSFLog.ScriptLoadUsageData();
		data.CorrelationId=trimStringToLowerCase(appCorrelationId);
		data.SessionId=sessionId;
		data.ScriptId=scriptId;
		data.StartTime=msStartTime;
		data.ResponseTime=msResponseTime;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onScriptDone=onScriptDone;
	function onCallDone(apiType, id, parameters, msResponseTime, errorType) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.APIUsageUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.APIType=apiType;
		data.APIID=id;
		data.Parameters=parameters;
		data.ResponseTime=msResponseTime;
		data.ErrorType=errorType;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onCallDone=onCallDone;
	;
	function onMethodDone(id, args, msResponseTime, errorType) {
		var parameters=null;
		if (args) {
			if (typeof args=="number") {
				parameters=String(args);
			}
			else if (typeof args==="object") {
				for (var index in args) {
					if (parameters !==null) {
						parameters+=",";
					}
					else {
						parameters="";
					}
					if (typeof args[index]=="number") {
						parameters+=String(args[index]);
					}
				}
			}
			else {
				parameters="";
			}
		}
		OSF.AppTelemetry.onCallDone("method", id, parameters, msResponseTime, errorType);
	}
	OSFAppTelemetry.onMethodDone=onMethodDone;
	function onPropertyDone(propertyName, msResponseTime) {
		OSF.AppTelemetry.onCallDone("property", -1, propertyName, msResponseTime);
	}
	OSFAppTelemetry.onPropertyDone=onPropertyDone;
	function onEventDone(id, errorType) {
		OSF.AppTelemetry.onCallDone("event", id, null, 0, errorType);
	}
	OSFAppTelemetry.onEventDone=onEventDone;
	function onRegisterDone(register, id, msResponseTime, errorType) {
		OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent", id, null, msResponseTime, errorType);
	}
	OSFAppTelemetry.onRegisterDone=onRegisterDone;
	function onAppClosed(openTime, focusTime) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.AppClosedUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.FocusTime=focusTime;
		data.OpenTime=openTime;
		data.AppSizeFinalWidth=window.innerWidth;
		data.AppSizeFinalHeight=window.innerHeight;
		(new AppStorage()).saveLog(sessionId, data.SerializeRow());
	}
	OSFAppTelemetry.onAppClosed=onAppClosed;
	function setOsfControlAppCorrelationId(correlationId) {
		osfControlAppCorrelationId=trimStringToLowerCase(correlationId);
	}
	OSFAppTelemetry.setOsfControlAppCorrelationId=setOsfControlAppCorrelationId;
	function doAppInitializationLogging(isException, message) {
		var data=new OSFLog.AppInitializationUsageData();
		data.CorrelationId=trimStringToLowerCase(osfControlAppCorrelationId);
		data.SessionId=sessionId;
		data.SuccessCode=isException ? 1 : 0;
		data.Message=message;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.doAppInitializationLogging=doAppInitializationLogging;
	function logAppCommonMessage(message) {
		doAppInitializationLogging(false, message);
	}
	OSFAppTelemetry.logAppCommonMessage=logAppCommonMessage;
	function logAppException(errorMessage) {
		doAppInitializationLogging(true, errorMessage);
	}
	OSFAppTelemetry.logAppException=logAppException;
	OSF.AppTelemetry=OSFAppTelemetry;
})(OSFAppTelemetry || (OSFAppTelemetry={}));
Microsoft.Office.WebExtension.FileType={
	Text: "text",
	Compressed: "compressed",
	Pdf: "pdf"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FileProperties: "FileProperties",
	FileSliceProperties: "FileSliceProperties"
});
OSF.DDA.FileProperties={
	Handle: "FileHandle",
	FileSize: "FileSize",
	SliceSize: Microsoft.Office.WebExtension.Parameters.SliceSize
};
OSF.DDA.File=function OSF_DDA_File(handle, fileSize, sliceSize) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"size": {
			value: fileSize
		},
		"sliceCount": {
			value: Math.ceil(fileSize / sliceSize)
		}
	});
	var privateState={};
	privateState[OSF.DDA.FileProperties.Handle]=handle;
	privateState[OSF.DDA.FileProperties.SliceSize]=sliceSize;
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDocumentCopyChunkAsync,
		am.ReleaseDocumentCopyAsync
	], privateState);
};
OSF.DDA.FileSliceOffset="fileSliceoffset";
OSF.DDA.AsyncMethodNames.addNames({
	GetDocumentCopyAsync: "getFileAsync",
	GetDocumentCopyChunkAsync: "getSliceAsync",
	ReleaseDocumentCopyAsync: "closeAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.FileType,
			"enum": Microsoft.Office.WebExtension.FileType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SliceSize,
			value: {
				"types": ["number"],
				"defaultValue": 64 * 1024
			}
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var sliceSize=callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize];
		if (sliceSize <=0 || sliceSize > (4 * 1024 * 1024)) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize;
		}
		return callArgs;
	},
	onSucceeded: function (fileDescriptor, caller, callArgs) {
		return new OSF.DDA.File(fileDescriptor[OSF.DDA.FileProperties.Handle], fileDescriptor[OSF.DDA.FileProperties.FileSize], callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize]);
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetDocumentCopyChunkAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.SliceIndex,
			"types": ["number"]
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		},
		{
			name: OSF.DDA.FileProperties.SliceSize,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.SliceSize]; }
		}
	],
	checkCallArgs: function (callArgs, caller, stateInfo) {
		var index=callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex];
		if (index < 0 || index >=caller.sliceCount) {
			throw OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange;
		}
		callArgs[OSF.DDA.FileSliceOffset]=parseInt((index * stateInfo[OSF.DDA.FileProperties.SliceSize]).toString());
		return callArgs;
	},
	onSucceeded: function (sliceDescriptor, caller, callArgs) {
		var slice={};
		OSF.OUtil.defineEnumerableProperties(slice, {
			"data": {
				value: sliceDescriptor[Microsoft.Office.WebExtension.Parameters.Data]
			},
			"index": {
				value: callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex]
			},
			"size": {
				value: sliceDescriptor[OSF.DDA.FileProperties.SliceSize]
			}
		});
		return slice;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ReleaseDocumentCopyAsync,
	privateStateCallbacks: [
		{
			name: OSF.DDA.FileProperties.Handle,
			value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
		}
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.FileType, {
	Text: "text",
	Pdf: "pdf"
});
Microsoft.Office.WebExtension.EventType={};
OSF.EventDispatch=function OSF_EventDispatch(eventTypes) {
	this._eventHandlers={};
	this._objectEventHandlers={};
	this._queuedEventsArgs={};
	for (var entry in eventTypes) {
		var eventType=eventTypes[entry];
		var isObjectEvent=(eventType=="objectDeleted" || eventType=="objectSelectionChanged" || eventType=="objectDataChanged" || eventType=="contentControlAdded");
		if (!isObjectEvent)
			this._eventHandlers[eventType]=[];
		else
			this._objectEventHandlers[eventType]={};
		this._queuedEventsArgs[eventType]=[];
	}
};
OSF.EventDispatch.prototype={
	getSupportedEvents: function OSF_EventDispatch$getSupportedEvents() {
		var events=[];
		for (var eventName in this._eventHandlers)
			events.push(eventName);
		for (var eventName in this._objectEventHandlers)
			events.push(eventName);
		return events;
	},
	supportsEvent: function OSF_EventDispatch$supportsEvent(event) {
		for (var eventName in this._eventHandlers) {
			if (event==eventName)
				return true;
		}
		for (var eventName in this._objectEventHandlers) {
			if (event==eventName)
				return true;
		}
		return false;
	},
	hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var h in handlers) {
				if (handlers[h]===handler)
					return true;
			}
		}
		return false;
	},
	hasObjectEventHandler: function OSF_EventDispatch$hasObjectEventHandler(eventType, objectId, handler) {
		var handlers=this._objectEventHandlers[eventType];
		if (handlers !=null) {
			var _handlers=handlers[objectId];
			for (var i=0; _handlers !=null && i < _handlers.length; i++) {
				if (_handlers[i]===handler)
					return true;
			}
		}
		return false;
	},
	addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler) {
		if (typeof handler !="function") {
			return false;
		}
		var handlers=this._eventHandlers[eventType];
		if (handlers && !this.hasEventHandler(eventType, handler)) {
			handlers.push(handler);
			return true;
		}
		else {
			return false;
		}
	},
	addObjectEventHandler: function OSF_EventDispatch$addObjectEventHandler(eventType, objectId, handler) {
		if (typeof handler !="function") {
			return false;
		}
		var handlers=this._objectEventHandlers[eventType];
		if (handlers && !this.hasObjectEventHandler(eventType, objectId, handler)) {
			if (handlers[objectId]==null)
				handlers[objectId]=[];
			handlers[objectId].push(handler);
			return true;
		}
		return false;
	},
	addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		var isFirstHandler=handlers.length==0;
		var succeed=this.addEventHandler(eventType, handler);
		if (isFirstHandler && succeed) {
			this.fireQueuedEvent(eventType);
		}
		return succeed;
	},
	removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler) {
		var handlers=this._eventHandlers[eventType];
		if (handlers && handlers.length > 0) {
			for (var index=0; index < handlers.length; index++) {
				if (handlers[index]===handler) {
					handlers.splice(index, 1);
					return true;
				}
			}
		}
		return false;
	},
	removeObjectEventHandler: function OSF_EventDispatch$removeObjectEventHandler(eventType, objectId, handler) {
		var handlers=this._objectEventHandlers[eventType];
		if (handlers !=null) {
			var _handlers=handlers[objectId];
			for (var i=0; _handlers !=null && i < _handlers.length; i++) {
				if (_handlers[i]===handler) {
					_handlers.splice(i, 1);
					return true;
				}
			}
		}
		return false;
	},
	clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType) {
		if (typeof this._eventHandlers[eventType] !="undefined" && this._eventHandlers[eventType].length > 0) {
			this._eventHandlers[eventType]=[];
			return true;
		}
		return false;
	},
	clearObjectEventHandlers: function OSF_EventDispatch$clearObjectEventHandlers(eventType, objectId) {
		if (this._objectEventHandlers[eventType] !=null && this._objectEventHandlers[eventType][objectId] !=null) {
			this._objectEventHandlers[eventType][objectId]=[];
			return true;
		}
		return false;
	},
	getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType) {
		return this._eventHandlers[eventType] !=undefined ? this._eventHandlers[eventType].length : -1;
	},
	getObjectEventHandlerCount: function OSF_EventDispatch$getObjectEventHandlerCount(eventType, objectId) {
		if (this._objectEventHandlers[eventType]==null || this._objectEventHandlers[eventType][objectId]==null)
			return 0;
		return this._objectEventHandlers[eventType][objectId].length;
	},
	fireEvent: function OSF_EventDispatch$fireEvent(eventArgs) {
		if (eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			for (var handler in eventHandlers)
				eventHandlers[handler](eventArgs);
			return true;
		}
		else {
			return false;
		}
	},
	fireObjectEvent: function OSF_EventDispatch$fireObjectEvent(objectId, eventArgs) {
		if (eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if (eventType && this._objectEventHandlers[eventType]) {
			var eventHandlers=this._objectEventHandlers[eventType];
			var _handlers=eventHandlers[objectId];
			if (_handlers !=null) {
				for (var i=0; i < _handlers.length; i++)
					_handlers[i](eventArgs);
				return true;
			}
		}
		return false;
	},
	fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs) {
		var eventType=eventArgs.type;
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length==0) {
				queuedEvents.push(eventArgs);
			}
			else {
				this.fireEvent(eventArgs);
			}
			return true;
		}
		else {
			return false;
		}
	},
	fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType) {
		if (eventType && this._eventHandlers[eventType]) {
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (eventHandlers.length > 0) {
				var eventHandler=eventHandlers[0];
				while (queuedEvents.length > 0) {
					var eventArgs=queuedEvents.shift();
					eventHandler(eventArgs);
				}
				return true;
			}
		}
		return false;
	},
	clearQueuedEvent: function OSF_EventDispatch$clearQueuedEvent(eventType) {
		if (eventType && this._eventHandlers[eventType]) {
			var queuedEvents=this._queuedEventsArgs[eventType];
			if (queuedEvents) {
				this._queuedEventsArgs[eventType]=[];
			}
		}
	}
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureEventArgs=function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties) {
	var args;
	switch (eventType) {
		case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
			args=new OSF.DDA.DocumentSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
			args=new OSF.DDA.BindingSelectionChangedEventArgs(this.manufactureBinding(eventProperties, target.document), eventProperties[OSF.DDA.PropertyDescriptors.Subset]);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
			args=new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties, target.document));
			break;
		case Microsoft.Office.WebExtension.EventType.SettingsChanged:
			args=new OSF.DDA.SettingsChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
			args=new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.OfficeThemeChanged:
			args=new OSF.DDA.Theming.OfficeThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DocumentThemeChanged:
			args=new OSF.DDA.Theming.DocumentThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
			args=OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.ObjectDeleted:
		case Microsoft.Office.WebExtension.EventType.ObjectSelectionChanged:
		case Microsoft.Office.WebExtension.EventType.ObjectDataChanged:
		case Microsoft.Office.WebExtension.EventType.ContentControlAdded:
			args=new OSF.DDA.ObjectEventArgs(eventType, eventProperties[Microsoft.Office.WebExtension.Parameters.Id]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
			args=new OSF.DDA.NodeInsertedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
			args=new OSF.DDA.NodeReplacedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
			args=new OSF.DDA.NodeDeletedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.TaskSelectionChanged:
			args=new OSF.DDA.TaskSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ResourceSelectionChanged:
			args=new OSF.DDA.ResourceSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ViewSelectionChanged:
			args=new OSF.DDA.ViewSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.DialogMessageReceived:
			args=new OSF.DDA.DialogEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived:
			args=new OSF.DDA.DialogParentEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.ItemChanged:
			if (OSF._OfficeAppFactory.getHostInfo()["hostType"]=="outlook" || OSF._OfficeAppFactory.getHostInfo()["hostType"]=="outlookwebapp") {
				args=new OSF.DDA.OlkItemSelectedChangedEventArgs(eventProperties);
				target.initialize(args["initialData"]);
				target.setCurrentItemNumber(args["itemNumber"].itemNumber);
			}
			else {
				throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
			}
			break;
		default:
			throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
	}
	return args;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddHandlerAsync: "addHandlerAsync",
	RemoveHandlerAsync: "removeHandlerAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddHandlerAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			value: {
				"types": ["function", "object"],
				"defaultValue": null
			}
		}
	],
	privateStateCallbacks: []
});
OSF.DialogShownStatus={ hasDialogShown: false, isWindowDialog: false };
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
	DialogMessageReceivedEvent: "DialogMessageReceivedEvent"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	DialogMessageReceived: "dialogMessageReceived",
	DialogEventReceived: "dialogEventReceived"
});
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	MessageType: "messageType",
	MessageContent: "messageContent"
});
OSF.DDA.DialogEventType={};
OSF.OUtil.augmentList(OSF.DDA.DialogEventType, {
	DialogClosed: "dialogClosed",
	NavigationFailed: "naviationFailed"
});
OSF.DDA.AsyncMethodNames.addNames({
	DisplayDialogAsync: "displayDialogAsync",
	CloseAsync: "close"
});
OSF.DDA.SyncMethodNames.addNames({
	MessageParent: "messageParent",
	AddMessageHandler: "addEventHandler",
	SendMessage: "sendMessage"
});
OSF.DDA.UI.ParentUI=function OSF_DDA_ParentUI() {
	var eventDispatch=new OSF.EventDispatch([
		Microsoft.Office.WebExtension.EventType.DialogMessageReceived,
		Microsoft.Office.WebExtension.EventType.DialogEventReceived,
		Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
	]);
	var openDialogName=OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
	var target=this;
	if (!target[openDialogName]) {
		OSF.OUtil.defineEnumerableProperty(target, openDialogName, {
			value: function () {
				var openDialog=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
				openDialog(arguments, eventDispatch, target);
			}
		});
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DDA.UI.ChildUI=function OSF_DDA_ChildUI(isPopupWindow) {
	var messageParentName=OSF.DDA.SyncMethodNames.MessageParent.displayName;
	var target=this;
	if (!target[messageParentName]) {
		OSF.OUtil.defineEnumerableProperty(target, messageParentName, {
			value: function () {
				var messageParent=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
				return messageParent(arguments, target);
			}
		});
	}
	var addEventHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
	if (!target[addEventHandler] && typeof OSF.DialogParentMessageEventDispatch !="undefined") {
		OSF.DDA.DispIdHost.addEventSupport(target, OSF.DialogParentMessageEventDispatch, isPopupWindow);
	}
	OSF.OUtil.finalizeProperties(this);
};
OSF.DialogHandler=function OSF_DialogHandler() { };
OSF.DDA.DialogEventArgs=function OSF_DDA_DialogEventArgs(message) {
	if (message[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogMessageReceived) {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived
			},
			"message": {
				value: message[OSF.DDA.PropertyDescriptors.MessageContent]
			}
		});
	}
	else {
		OSF.OUtil.defineEnumerableProperties(this, {
			"type": {
				value: Microsoft.Office.WebExtension.EventType.DialogEventReceived
			},
			"error": {
				value: message[OSF.DDA.PropertyDescriptors.MessageType]
			}
		});
	}
};
OSF.DDA.DialogParentEventArgs=function OSF_DDA_DialogParentEventArgs(message) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
		},
		"message": {
			value: message[OSF.DDA.PropertyDescriptors.MessageContent]
		}
	});
};
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.Url,
			"types": ["string"]
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Width,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.Height,
			value: {
				"types": ["number"],
				"defaultValue": 99
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.RequireHTTPs,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.DisplayInIframe,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		},
		{
			name: Microsoft.Office.WebExtension.Parameters.HideTitle,
			value: {
				"types": ["boolean"],
				"defaultValue": false
			}
		}
	],
	privateStateCallbacks: [],
	onSucceeded: function (args, caller, callArgs) {
		var targetId=args[Microsoft.Office.WebExtension.Parameters.Id];
		var eventDispatch=args[Microsoft.Office.WebExtension.Parameters.Data];
		var dialog=new OSF.DialogHandler();
		var closeDialog=OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, closeDialog, {
			value: function () {
				var closeDialogfunction=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
				closeDialogfunction(arguments, targetId, eventDispatch, dialog);
			}
		});
		var addHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, addHandler, {
			value: function () {
				var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
				var callArgs=syncMethodCall.verifyAndExtractCall(arguments, dialog, eventDispatch);
				var eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
				var handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
				return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType, handler);
			}
		});
		var sendMessage=OSF.DDA.SyncMethodNames.SendMessage.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog, sendMessage, {
			value: function () {
				var execute=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.SendMessage];
				return execute(arguments, eventDispatch, dialog);
			}
		});
		return dialog;
	},
	checkCallArgs: function (callArgs, caller, stateInfo) {
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=1;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=99;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] <=0) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=1;
		}
		if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100) {
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=99;
		}
		if (!callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs]) {
			callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs]=true;
		}
		return callArgs;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.CloseAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.MessageParent,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.MessageToParent,
			"types": ["string", "number", "boolean"]
		}
	],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.AddMessageHandler,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			"verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.Handler,
			"types": ["function"]
		}
	],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.SendMessage,
	requiredArguments: [
		{
			"name": Microsoft.Office.WebExtension.Parameters.MessageContent,
			"types": ["string"]
		}
	],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.SafeArray.Delegate.openDialog=function OSF_DDA_SafeArray_Delegate$OpenDialog(args) {
	try {
		if (args.onCalling) {
			args.onCalling();
		}
		var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true, args);
		OSF.ClientHostController.openDialog(args.dispId, args.targetId, function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload) {
			if (args.onEvent) {
				args.onEvent(payload);
			}
			if (OSF.AppTelemetry) {
				OSF.AppTelemetry.onEventDone(args.dispId);
			}
		}, callback);
	}
	catch (ex) {
		OSF.DDA.SafeArray.Delegate._onException(ex, args);
	}
};
OSF.DDA.SafeArray.Delegate.closeDialog=function OSF_DDA_SafeArray_Delegate$CloseDialog(args) {
	if (args.onCalling) {
		args.onCalling();
	}
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false, args);
	try {
		OSF.ClientHostController.closeDialog(args.dispId, args.targetId, callback);
	}
	catch (ex) {
		OSF.DDA.SafeArray.Delegate._onException(ex, args);
	}
};
OSF.DDA.SafeArray.Delegate.messageParent=function OSF_DDA_SafeArray_Delegate$MessageParent(args) {
	try {
		if (args.onCalling) {
			args.onCalling();
		}
		var startTime=(new Date()).getTime();
		var result=OSF.ClientHostController.messageParent(args.hostCallArgs);
		if (args.onReceiving) {
			args.onReceiving();
		}
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), result);
		}
		return result;
	}
	catch (ex) {
		return OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod(ex);
	}
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.MessageType, value: 0 },
		{ name: OSF.DDA.PropertyDescriptors.MessageContent, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.sendMessage=function OSF_DDA_SafeArray_Delegate$SendMessage(args) {
	try {
		if (args.onCalling) {
			args.onCalling();
		}
		var startTime=(new Date()).getTime();
		var result=OSF.ClientHostController.sendMessage(args.hostCallArgs);
		if (args.onReceiving) {
			args.onReceiving();
		}
		return result;
	}
	catch (ex) {
		return OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod(ex);
	}
};
OSF.DDA.FilePropertiesDescriptor={
	Url: "Url"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	FilePropertiesDescriptor: "FilePropertiesDescriptor"
});
Microsoft.Office.WebExtension.FileProperties=function Microsoft_Office_WebExtension_FileProperties(filePropertiesDescriptor) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"url": {
			value: filePropertiesDescriptor[OSF.DDA.FilePropertiesDescriptor.Url]
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({ GetFilePropertiesAsync: "getFilePropertiesAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: 0 }
	],
	requiredArguments: [],
	supportedOptions: [],
	onSucceeded: function (filePropertiesDescriptor, caller, callArgs) {
		return new Microsoft.Office.WebExtension.FileProperties(filePropertiesDescriptor);
	}
});
Microsoft.Office.WebExtension.GoToType={
	Binding: "binding",
	NamedItem: "namedItem",
	Slide: "slide",
	Index: "index"
};
Microsoft.Office.WebExtension.SelectionMode={
	Default: "default",
	Selected: "selected",
	None: "none"
};
Microsoft.Office.WebExtension.Index={
	First: "first",
	Last: "last",
	Next: "next",
	Previous: "previous"
};
OSF.DDA.AsyncMethodNames.addNames({ GoToByIdAsync: "goToByIdAsync" });
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.GoToByIdAsync,
	requiredArguments: [{
			"name": Microsoft.Office.WebExtension.Parameters.Id,
			"types": ["string", "number"]
		},
		{
			"name": Microsoft.Office.WebExtension.Parameters.GoToType,
			"enum": Microsoft.Office.WebExtension.GoToType
		}
	],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.SelectionMode,
			value: {
				"enum": Microsoft.Office.WebExtension.SelectionMode,
				"defaultValue": Microsoft.Office.WebExtension.SelectionMode.Default
			}
		}
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.GoToType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.GoToType.Binding, value: 0 },
		{ name: Microsoft.Office.WebExtension.GoToType.NamedItem, value: 1 },
		{ name: Microsoft.Office.WebExtension.GoToType.Slide, value: 2 },
		{ name: Microsoft.Office.WebExtension.GoToType.Index, value: 3 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.SelectionMode,
	toHost: [
		{ name: Microsoft.Office.WebExtension.SelectionMode.Default, value: 0 },
		{ name: Microsoft.Office.WebExtension.SelectionMode.Selected, value: 1 },
		{ name: Microsoft.Office.WebExtension.SelectionMode.None, value: 2 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidNavigateToMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.GoToType, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.SelectionMode, value: 2 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileProperties,
	fromHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: 0 },
		{ name: OSF.DDA.FileProperties.FileSize, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FileSliceProperties,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 0 },
		{ name: OSF.DDA.FileProperties.SliceSize, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.FileType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.FileType.Text, value: 0 },
		{ name: Microsoft.Office.WebExtension.FileType.Compressed, value: 5 },
		{ name: Microsoft.Office.WebExtension.FileType.Pdf, value: 6 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyMethod,
	toHost: [{ name: Microsoft.Office.WebExtension.Parameters.FileType, value: 0 }],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDocumentCopyChunkMethod,
	toHost: [
		{ name: OSF.DDA.FileProperties.Handle, value: 0 },
		{ name: OSF.DDA.FileSliceOffset, value: 1 },
		{ name: OSF.DDA.FileProperties.SliceSize, value: 2 }
	],
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FileSliceProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseDocumentCopyMethod,
	toHost: [{ name: OSF.DDA.FileProperties.Handle, value: 0 }]
});
OSF.DDA.AsyncMethodNames.addNames({
	GetSelectedDataAsync: "getSelectedDataAsync",
	SetSelectedDataAsync: "setSelectedDataAsync"
});
(function () {
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.CoercionType,
				"enum": Microsoft.Office.WebExtension.CoercionType
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [
			{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) {
						return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]);
					}
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageLeft,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageTop,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageWidth,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ImageHeight,
				value: {
					"types": ["number", "boolean"],
					"defaultValue": false
				}
			}
		],
		privateStateCallbacks: []
	});
})();
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.FilterType, value: 2 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageLeft, value: 2 },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageTop, value: 3 },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageWidth, value: 4 },
		{ name: Microsoft.Office.WebExtension.Parameters.ImageHeight, value: 5 },
	]
});
OSF.DDA.SettingsManager={
	SerializedSettings: "serializedSettings",
	RefreshingSettings: "refreshingSettings",
	DateJSONPrefix: "Date(",
	DataJSONSuffix: ")",
	serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection) {
		var ret={};
		for (var key in settingsCollection) {
			var value=settingsCollection[key];
			try {
				if (JSON) {
					value=JSON.stringify(value, function dateReplacer(k, v) {
						return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix+this[k].getTime()+OSF.DDA.SettingsManager.DataJSONSuffix : v;
					});
				}
				else {
					value=Sys.Serialization.JavaScriptSerializer.serialize(value);
				}
				ret[key]=value;
			}
			catch (ex) {
			}
		}
		return ret;
	},
	deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings) {
		var ret={};
		serializedSettings=serializedSettings || {};
		for (var key in serializedSettings) {
			var value=serializedSettings[key];
			try {
				if (JSON) {
					value=JSON.parse(value, function dateReviver(k, v) {
						var d;
						if (typeof v==='string' && v && v.length > 6 && v.slice(0, 5)===OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1)===OSF.DDA.SettingsManager.DataJSONSuffix) {
							d=new Date(parseInt(v.slice(5, -1)));
							if (d) {
								return d;
							}
						}
						return v;
					});
				}
				else {
					value=Sys.Serialization.JavaScriptSerializer.deserialize(value, true);
				}
				ret[key]=value;
			}
			catch (ex) {
			}
		}
		return ret;
	}
};
OSF.DDA.Settings=function OSF_DDA_Settings(settings) {
	settings=settings || {};
	var cacheSessionSettings=function (settings) {
		var osfSessionStorage=OSF.OUtil.getSessionStorage();
		if (osfSessionStorage) {
			var serializedSettings=OSF.DDA.SettingsManager.serializeSettings(settings);
			var storageSettings=JSON ? JSON.stringify(serializedSettings) : Sys.Serialization.JavaScriptSerializer.serialize(serializedSettings);
			osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
		}
	};
	OSF.OUtil.defineEnumerableProperties(this, {
		"get": {
			value: function OSF_DDA_Settings$get(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				var setting=settings[name];
				return typeof (setting)==='undefined' ? null : setting;
			}
		},
		"set": {
			value: function OSF_DDA_Settings$set(name, value) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false },
					{ name: "value", mayBeNull: true }
				]);
				if (e)
					throw e;
				settings[name]=value;
				cacheSessionSettings(settings);
			}
		},
		"remove": {
			value: function OSF_DDA_Settings$remove(name) {
				var e=Function._validateParams(arguments, [
					{ name: "name", type: String, mayBeNull: false }
				]);
				if (e)
					throw e;
				delete settings[name];
				cacheSessionSettings(settings);
			}
		}
	});
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.SaveAsync], settings);
};
OSF.DDA.RefreshableSettings=function OSF_DDA_RefreshableSettings(settings) {
	OSF.DDA.RefreshableSettings.uber.constructor.call(this, settings);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.RefreshAsync], settings);
	OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.SettingsChanged]));
};
OSF.OUtil.extend(OSF.DDA.RefreshableSettings, OSF.DDA.Settings);
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	SettingsChanged: "settingsChanged"
});
OSF.DDA.SettingsChangedEventArgs=function OSF_DDA_SettingsChangedEventArgs(settingsInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.SettingsChanged
		},
		"settings": {
			value: settingsInstance
		}
	});
};
OSF.DDA.AsyncMethodNames.addNames({
	RefreshAsync: "refreshAsync",
	SaveAsync: "saveAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RefreshAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.RefreshingSettings,
			value: function getRefreshingSettings(settingsInstance, settingsCollection) {
				return settingsCollection;
			}
		}
	],
	onSucceeded: function deserializeSettings(serializedSettingsDescriptor, refreshingSettings, refreshingSettingsArgs) {
		var serializedSettings=serializedSettingsDescriptor[OSF.DDA.SettingsManager.SerializedSettings];
		var newSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		var oldSettings=refreshingSettingsArgs[OSF.DDA.SettingsManager.RefreshingSettings];
		for (var setting in oldSettings) {
			refreshingSettings.remove(setting);
		}
		for (var setting in newSettings) {
			refreshingSettings.set(setting, newSettings[setting]);
		}
		return refreshingSettings;
	}
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.SaveAsync,
	requiredArguments: [],
	supportedOptions: [
		{
			name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale,
			value: {
				"types": ["boolean"],
				"defaultValue": true
			}
		}
	],
	privateStateCallbacks: [
		{
			name: OSF.DDA.SettingsManager.SerializedSettings,
			value: function serializeSettings(settingsInstance, settingsCollection) {
				return OSF.DDA.SettingsManager.serializeSettings(settingsCollection);
			}
		}
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidLoadSettingsMethod,
	fromHost: [
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSaveSettingsMethod,
	toHost: [
		{ name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.SettingsManager.SerializedSettings },
		{ name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale, value: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidSettingsChangedEvent });
Microsoft.Office.WebExtension.BindingType={
	Table: "table",
	Text: "text",
	Matrix: "matrix"
};
OSF.DDA.BindingProperties={
	Id: "BindingId",
	Type: Microsoft.Office.WebExtension.Parameters.BindingType
};
OSF.OUtil.augmentList(OSF.DDA.ListDescriptors, { BindingList: "BindingList" });
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	Subset: "subset",
	BindingProperties: "BindingProperties"
});
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.BindingList, OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.BindingPromise=function OSF_DDA_BindingPromise(bindingId, errorCallback) {
	this._id=bindingId;
	OSF.OUtil.defineEnumerableProperty(this, "onFail", {
		get: function () {
			return errorCallback;
		},
		set: function (onError) {
			var t=typeof onError;
			if (t !="undefined" && t !="function") {
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, t);
			}
			errorCallback=onError;
		}
	});
};
OSF.DDA.BindingPromise.prototype={
	_fetch: function OSF_DDA_BindingPromise$_fetch(onComplete) {
		if (this.binding) {
			if (onComplete)
				onComplete(this.binding);
		}
		else {
			if (!this._binding) {
				var me=this;
				Microsoft.Office.WebExtension.context.document.bindings.getByIdAsync(this._id, function (asyncResult) {
					if (asyncResult.status==Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded) {
						OSF.OUtil.defineEnumerableProperty(me, "binding", {
							value: asyncResult.value
						});
						if (onComplete)
							onComplete(me.binding);
					}
					else {
						if (me.onFail)
							me.onFail(asyncResult);
					}
				});
			}
		}
		return this;
	},
	getDataAsync: function OSF_DDA_BindingPromise$getDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.getDataAsync.apply(binding, args); });
		return this;
	},
	setDataAsync: function OSF_DDA_BindingPromise$setDataAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.setDataAsync.apply(binding, args); });
		return this;
	},
	addHandlerAsync: function OSF_DDA_BindingPromise$addHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.addHandlerAsync.apply(binding, args); });
		return this;
	},
	removeHandlerAsync: function OSF_DDA_BindingPromise$removeHandlerAsync() {
		var args=arguments;
		this._fetch(function onComplete(binding) { binding.removeHandlerAsync.apply(binding, args); });
		return this;
	}
};
OSF.DDA.BindingFacade=function OSF_DDA_BindingFacade(docInstance) {
	this._eventDispatches=[];
	OSF.OUtil.defineEnumerableProperty(this, "document", {
		value: docInstance
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddFromSelectionAsync,
		am.AddFromNamedItemAsync,
		am.GetAllAsync,
		am.GetByIdAsync,
		am.ReleaseByIdAsync
	]);
};
OSF.DDA.UnknownBinding=function OSF_DDA_UknonwnBinding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": { value: docInstance },
		"id": { value: id }
	});
};
OSF.DDA.Binding=function OSF_DDA_Binding(id, docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"document": {
			value: docInstance
		},
		"id": {
			value: id
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetDataAsync,
		am.SetDataAsync
	]);
	var et=Microsoft.Office.WebExtension.EventType;
	var bindingEventDispatches=docInstance.bindings._eventDispatches;
	if (!bindingEventDispatches[id]) {
		bindingEventDispatches[id]=new OSF.EventDispatch([
			et.BindingSelectionChanged,
			et.BindingDataChanged
		]);
	}
	var eventDispatch=bindingEventDispatches[id];
	OSF.DDA.DispIdHost.addEventSupport(this, eventDispatch);
};
OSF.DDA.generateBindingId=function OSF_DDA$GenerateBindingId() {
	return "UnnamedBinding_"+OSF.OUtil.getUniqueId()+"_"+new Date().getTime();
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureBinding=function OSF_DDA_OMFactory$manufactureBinding(bindingProperties, containingDocument) {
	var id=bindingProperties[OSF.DDA.BindingProperties.Id];
	var rows=bindingProperties[OSF.DDA.BindingProperties.RowCount];
	var cols=bindingProperties[OSF.DDA.BindingProperties.ColumnCount];
	var hasHeaders=bindingProperties[OSF.DDA.BindingProperties.HasHeaders];
	var binding;
	switch (bindingProperties[OSF.DDA.BindingProperties.Type]) {
		case Microsoft.Office.WebExtension.BindingType.Text:
			binding=new OSF.DDA.TextBinding(id, containingDocument);
			break;
		case Microsoft.Office.WebExtension.BindingType.Matrix:
			binding=new OSF.DDA.MatrixBinding(id, containingDocument, rows, cols);
			break;
		case Microsoft.Office.WebExtension.BindingType.Table:
			var isExcelApp=function () {
				return (OSF.DDA.ExcelDocument)
					&& (Microsoft.Office.WebExtension.context.document)
					&& (Microsoft.Office.WebExtension.context.document instanceof OSF.DDA.ExcelDocument);
			};
			var tableBindingObject;
			if (isExcelApp() && OSF.DDA.ExcelTableBinding) {
				tableBindingObject=OSF.DDA.ExcelTableBinding;
			}
			else {
				tableBindingObject=OSF.DDA.TableBinding;
			}
			binding=new tableBindingObject(id, containingDocument, rows, cols, hasHeaders);
			break;
		default:
			binding=new OSF.DDA.UnknownBinding(id, containingDocument);
	}
	return binding;
};
OSF.DDA.AsyncMethodNames.addNames({
	AddFromSelectionAsync: "addFromSelectionAsync",
	AddFromNamedItemAsync: "addFromNamedItemAsync",
	GetAllAsync: "getAllAsync",
	GetByIdAsync: "getByIdAsync",
	ReleaseByIdAsync: "releaseByIdAsync",
	GetDataAsync: "getDataAsync",
	SetDataAsync: "setDataAsync"
});
(function () {
	function processBinding(bindingDescriptor) {
		return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document);
	}
	function getObjectId(obj) { return obj.id; }
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
			data=OSF.DDA.OMFactory.manufactureTableData(data);
		}
		data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
		return data==undefined ? null : data;
	}
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromSelectionAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddFromNamedItemAsync,
		requiredArguments: [{
				"name": Microsoft.Office.WebExtension.Parameters.ItemName,
				"types": ["string"]
			},
			{
				"name": Microsoft.Office.WebExtension.Parameters.BindingType,
				"enum": Microsoft.Office.WebExtension.BindingType
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: {
					"types": ["string"],
					"calculate": OSF.DDA.generateBindingId
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			}
		],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.FailOnCollision,
				value: function () { return true; }
			}
		],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetAllAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.BindingList], processBinding); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: processBinding
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.ReleaseByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response, caller, callArgs) {
			var id=callArgs[Microsoft.Office.WebExtension.Parameters.Id];
			delete caller._eventDispatches[id];
		}
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataAsync,
		requiredArguments: [],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs, binding) { return OSF.DDA.DataCoercion.getCoercionDefaultForBinding(binding.type); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
				value: {
					"enum": Microsoft.Office.WebExtension.ValueFormat,
					"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.FilterType,
				value: {
					"enum": Microsoft.Office.WebExtension.FilterType,
					"defaultValue": Microsoft.Office.WebExtension.FilterType.All
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.RowCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.ColumnCount,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.RowCount]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.RowCount];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetDataAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string", "object", "number", "boolean"]
			}
		],
		supportedOptions: [{
				name: Microsoft.Office.WebExtension.Parameters.CoercionType,
				value: {
					"enum": Microsoft.Office.WebExtension.CoercionType,
					"calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Rows,
				value: {
					"types": ["object", "string"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.Columns,
				value: {
					"types": ["object"],
					"defaultValue": null
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartRow,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			},
			{
				name: Microsoft.Office.WebExtension.Parameters.StartColumn,
				value: {
					"types": ["number"],
					"defaultValue": 0
				}
			}
		],
		checkCallArgs: function (callArgs, caller, stateInfo) {
			if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
				callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0) {
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
				delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
			}
			if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
				(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
					callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn])) {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
			}
			return callArgs;
		},
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.MatrixBinding=function OSF_DDA_MatrixBinding(id, docInstance, rows, cols) {
	OSF.DDA.MatrixBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Matrix
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		}
	});
};
OSF.OUtil.extend(OSF.DDA.MatrixBinding, OSF.DDA.Binding);
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.BindingProperties,
	fromHost: [
		{ name: OSF.DDA.BindingProperties.Id, value: 0 },
		{ name: OSF.DDA.BindingProperties.Type, value: 1 },
		{ name: OSF.DDA.SafeArray.UniqueArguments.BindingSpecificData, value: 2 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.BindingType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.BindingType.Text, value: 0 },
		{ name: Microsoft.Office.WebExtension.BindingType.Matrix, value: 1 },
		{ name: Microsoft.Office.WebExtension.BindingType.Table, value: 2 }
	],
	invertible: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromSelectionMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.BindingType, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddBindingFromNamedItemMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.ItemName, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.BindingType, value: 2 },
		{ name: Microsoft.Office.WebExtension.Parameters.FailOnCollision, value: 3 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidReleaseBindingMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetAllBindingsMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.BindingList, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetBindingDataMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: 2 },
		{ name: Microsoft.Office.WebExtension.Parameters.FilterType, value: 3 },
		{ name: OSF.DDA.PropertyDescriptors.Subset, value: 4 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 2 },
		{ name: OSF.DDA.SafeArray.UniqueArguments.Offset, value: 3 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.SafeArray.UniqueArguments.BindingSpecificData,
	fromHost: [
		{ name: OSF.DDA.BindingProperties.RowCount, value: 0 },
		{ name: OSF.DDA.BindingProperties.ColumnCount, value: 1 },
		{ name: OSF.DDA.BindingProperties.HasHeaders, value: 2 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.Subset,
	toHost: [
		{ name: OSF.DDA.SafeArray.UniqueArguments.Offset, value: 0 },
		{ name: OSF.DDA.SafeArray.UniqueArguments.Run, value: 1 }
	],
	canonical: true,
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.SafeArray.UniqueArguments.Offset,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.StartRow, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: 1 }
	],
	canonical: true,
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.SafeArray.UniqueArguments.Run,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.RowCount, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: 1 }
	],
	canonical: true,
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddRowsMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddColumnsMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidClearAllRowsMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
Microsoft.Office.WebExtension.TableData=function Microsoft_Office_WebExtension_TableData(rows, headers) {
	function fixData(data) {
		if (data==null || data==undefined) {
			return null;
		}
		try {
			for (var dim=OSF.DDA.DataCoercion.findArrayDimensionality(data, 2); dim < 2; dim++) {
				data=[data];
			}
			return data;
		}
		catch (ex) {
		}
	}
	;
	OSF.OUtil.defineEnumerableProperties(this, {
		"headers": {
			get: function () { return headers; },
			set: function (value) {
				headers=fixData(value);
			}
		},
		"rows": {
			get: function () { return rows; },
			set: function (value) {
				rows=(value==null || (OSF.OUtil.isArray(value) && (value.length==0))) ?
					[] :
					fixData(value);
			}
		}
	});
	this.headers=headers;
	this.rows=rows;
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureTableData=function OSF_DDA_OMFactory$manufactureTableData(tableDataProperties) {
	return new Microsoft.Office.WebExtension.TableData(tableDataProperties[OSF.DDA.TableDataProperties.TableRows], tableDataProperties[OSF.DDA.TableDataProperties.TableHeaders]);
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, { TableDataProperties: "TableDataProperties" });
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
});
OSF.DDA.TableDataProperties={
	TableRows: "TableRows",
	TableHeaders: "TableHeaders"
};
OSF.DDA.TableBinding=function OSF_DDA_TableBinding(id, docInstance, rows, cols, hasHeaders) {
	OSF.DDA.TableBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.BindingType.Table
		},
		"rowCount": {
			value: rows ? rows : 0
		},
		"columnCount": {
			value: cols ? cols : 0
		},
		"hasHeaders": {
			value: hasHeaders ? hasHeaders : false
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddRowsAsync,
		am.AddColumnsAsync,
		am.DeleteAllDataValuesAsync
	]);
};
OSF.OUtil.extend(OSF.DDA.TableBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({
	AddRowsAsync: "addRowsAsync",
	AddColumnsAsync: "addColumnsAsync",
	DeleteAllDataValuesAsync: "deleteAllDataValuesAsync"
});
(function () {
	function getObjectId(obj) { return obj.id; }
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddRowsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddColumnsAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["object"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.DeleteAllDataValuesAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: Microsoft.Office.WebExtension.Parameters.Id,
				value: getObjectId
			}
		]
	});
})();
OSF.DDA.TextBinding=function OSF_DDA_TextBinding(id, docInstance) {
	OSF.DDA.TextBinding.uber.constructor.call(this, id, docInstance);
	OSF.OUtil.defineEnumerableProperty(this, "type", {
		value: Microsoft.Office.WebExtension.BindingType.Text
	});
};
OSF.OUtil.extend(OSF.DDA.TextBinding, OSF.DDA.Binding);
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { DocumentSelectionChanged: "documentSelectionChanged" });
OSF.DDA.DocumentSelectionChangedEventArgs=function OSF_DDA_DocumentSelectionChangedEventArgs(docInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged
		},
		"document": {
			value: docInstance
		}
	});
};
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectDeleted: "objectDeleted" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectSelectionChanged: "objectSelectionChanged" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ObjectDataChanged: "objectDataChanged" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { ContentControlAdded: "contentControlAdded" });
OSF.DDA.ObjectEventArgs=function OSF_DDA_ObjectEventArgs(eventType, object) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": { value: eventType },
		"object": { value: object }
	});
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidDocumentSelectionChangedEvent });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidObjectDeletedEvent,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.SafeArray.Delegate.ParameterMap.sourceData }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidObjectSelectionChangedEvent,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.SafeArray.Delegate.ParameterMap.sourceData }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidObjectDataChangedEvent,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.SafeArray.Delegate.ParameterMap.sourceData }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidContentControlAddedEvent,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.SafeArray.Delegate.ParameterMap.sourceData }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	BindingSelectionChanged: "bindingSelectionChanged",
	BindingDataChanged: "bindingDataChanged"
});
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, { BindingSelectionChangedEvent: "BindingSelectionChangedEvent" });
OSF.DDA.BindingSelectionChangedEventArgs=function OSF_DDA_BindingSelectionChangedEventArgs(bindingInstance, subset) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingSelectionChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
	for (var prop in subset) {
		OSF.OUtil.defineEnumerableProperty(this, prop, {
			value: subset[prop]
		});
	}
};
OSF.DDA.BindingDataChangedEventArgs=function OSF_DDA_BindingDataChangedEventArgs(bindingInstance) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.BindingDataChanged
		},
		"binding": {
			value: bindingInstance
		}
	});
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: 0 },
		{ name: OSF.DDA.PropertyDescriptors.Subset, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingSelectionChangedEvent,
	fromHost: [
		{ name: OSF.DDA.EventDescriptors.BindingSelectionChangedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidBindingDataChangedEvent,
	fromHost: [{ name: OSF.DDA.PropertyDescriptors.BindingProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }]
});
Microsoft.Office.WebExtension.CoercionType={
	Text: "text",
	Matrix: "matrix",
	Table: "table"
};
OSF.DDA.DataCoercion=(function OSF_DDA_DataCoercion() {
	return {
		findArrayDimensionality: function OSF_DDA_DataCoercion$findArrayDimensionality(obj) {
			if (OSF.OUtil.isArray(obj)) {
				var dim=0;
				for (var index=0; index < obj.length; index++) {
					dim=Math.max(dim, OSF.DDA.DataCoercion.findArrayDimensionality(obj[index]));
				}
				return dim+1;
			}
			else {
				return 0;
			}
		},
		getCoercionDefaultForBinding: function OSF_DDA_DataCoercion$getCoercionDefaultForBinding(bindingType) {
			switch (bindingType) {
				case Microsoft.Office.WebExtension.BindingType.Matrix: return Microsoft.Office.WebExtension.CoercionType.Matrix;
				case Microsoft.Office.WebExtension.BindingType.Table: return Microsoft.Office.WebExtension.CoercionType.Table;
				case Microsoft.Office.WebExtension.BindingType.Text:
				default:
					return Microsoft.Office.WebExtension.CoercionType.Text;
			}
		},
		getBindingDefaultForCoercion: function OSF_DDA_DataCoercion$getBindingDefaultForCoercion(coercionType) {
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Matrix: return Microsoft.Office.WebExtension.BindingType.Matrix;
				case Microsoft.Office.WebExtension.CoercionType.Table: return Microsoft.Office.WebExtension.BindingType.Table;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					return Microsoft.Office.WebExtension.BindingType.Text;
			}
		},
		determineCoercionType: function OSF_DDA_DataCoercion$determineCoercionType(data) {
			if (data==null || data==undefined)
				return null;
			var sourceType=null;
			var runtimeType=typeof data;
			if (data.rows !==undefined) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Table;
			}
			else if (OSF.OUtil.isArray(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Matrix;
			}
			else if (runtimeType=="string" || runtimeType=="number" || runtimeType=="boolean" || OSF.OUtil.isDate(data)) {
				sourceType=Microsoft.Office.WebExtension.CoercionType.Text;
			}
			else {
				throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject;
			}
			return sourceType;
		},
		coerceData: function OSF_DDA_DataCoercion$coerceData(data, destinationType, sourceType) {
			sourceType=sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
			if (sourceType && sourceType !=destinationType) {
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionBegin);
				data=OSF.DDA.DataCoercion._coerceDataFromTable(destinationType, OSF.DDA.DataCoercion._coerceDataToTable(data, sourceType));
				OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionEnd);
			}
			return data;
		},
		_matrixToText: function OSF_DDA_DataCoercion$_matrixToText(matrix) {
			if (matrix.length==1 && matrix[0].length==1)
				return ""+matrix[0][0];
			var val="";
			for (var i=0; i < matrix.length; i++) {
				val+=matrix[i].join("\t")+"\n";
			}
			return val.substring(0, val.length - 1);
		},
		_textToMatrix: function OSF_DDA_DataCoercion$_textToMatrix(text) {
			var ret=text.split("\n");
			for (var i=0; i < ret.length; i++)
				ret[i]=ret[i].split("\t");
			return ret;
		},
		_tableToText: function OSF_DDA_DataCoercion$_tableToText(table) {
			var headers="";
			if (table.headers !=null) {
				headers=OSF.DDA.DataCoercion._matrixToText([table.headers])+"\n";
			}
			var rows=OSF.DDA.DataCoercion._matrixToText(table.rows);
			if (rows=="") {
				headers=headers.substring(0, headers.length - 1);
			}
			return headers+rows;
		},
		_tableToMatrix: function OSF_DDA_DataCoercion$_tableToMatrix(table) {
			var matrix=table.rows;
			if (table.headers !=null) {
				matrix.unshift(table.headers);
			}
			return matrix;
		},
		_coerceDataFromTable: function OSF_DDA_DataCoercion$_coerceDataFromTable(coercionType, table) {
			var value;
			switch (coercionType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=table;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=OSF.DDA.DataCoercion._tableToMatrix(table);
					break;
				case Microsoft.Office.WebExtension.CoercionType.SlideRange:
					value=null;
					if (OSF.DDA.OMFactory.manufactureSlideRange) {
						value=OSF.DDA.OMFactory.manufactureSlideRange(OSF.DDA.DataCoercion._tableToText(table));
					}
					if (value==null) {
						value=OSF.DDA.DataCoercion._tableToText(table);
					}
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=OSF.DDA.DataCoercion._tableToText(table);
					break;
			}
			return value;
		},
		_coerceDataToTable: function OSF_DDA_DataCoercion$_coerceDataToTable(data, sourceType) {
			if (sourceType==undefined) {
				sourceType=OSF.DDA.DataCoercion.determineCoercionType(data);
			}
			var value;
			switch (sourceType) {
				case Microsoft.Office.WebExtension.CoercionType.Table:
					value=data;
					break;
				case Microsoft.Office.WebExtension.CoercionType.Matrix:
					value=new Microsoft.Office.WebExtension.TableData(data);
					break;
				case Microsoft.Office.WebExtension.CoercionType.Text:
				case Microsoft.Office.WebExtension.CoercionType.Html:
				case Microsoft.Office.WebExtension.CoercionType.Ooxml:
				default:
					value=new Microsoft.Office.WebExtension.TableData(OSF.DDA.DataCoercion._textToMatrix(data));
					break;
			}
			return value;
		}
	};
})();
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.Text, value: 0 },
		{ name: Microsoft.Office.WebExtension.CoercionType.Matrix, value: 1 },
		{ name: Microsoft.Office.WebExtension.CoercionType.Table, value: 2 }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Html: "html" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.Html, value: 3 }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Ooxml: "ooxml" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.Ooxml, value: 4 }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { OoxmlPackage: "ooxmlPackage" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.OoxmlPackage, value: 5 }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { PdfFile: "pdf" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.PdfFile, value: 6 }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.FilterType, { OnlyVisible: "onlyVisible" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.FilterType,
	toHost: [{ name: Microsoft.Office.WebExtension.FilterType.OnlyVisible, value: 1 }]
});
OSF.DDA.DataPartProperties={
	Id: Microsoft.Office.WebExtension.Parameters.Id,
	BuiltIn: "DataPartBuiltIn"
};
OSF.DDA.DataNodeProperties={
	Handle: "DataNodeHandle",
	BaseName: "DataNodeBaseName",
	NamespaceUri: "DataNodeNamespaceUri",
	NodeType: "DataNodeType"
};
OSF.DDA.DataNodeEventProperties={
	OldNode: "OldNode",
	NewNode: "NewNode",
	NextSiblingNode: "NextSiblingNode",
	InUndoRedo: "InUndoRedo"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
	DataPartProperties: "DataPartProperties",
	DataNodeProperties: "DataNodeProperties"
});
OSF.OUtil.augmentList(OSF.DDA.ListDescriptors, {
	DataPartList: "DataPartList",
	DataNodeList: "DataNodeList"
});
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.DataPartList, OSF.DDA.PropertyDescriptors.DataPartProperties);
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.DataNodeList, OSF.DDA.PropertyDescriptors.DataNodeProperties);
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
	DataNodeInsertedEvent: "DataNodeInsertedEvent",
	DataNodeReplacedEvent: "DataNodeReplacedEvent",
	DataNodeDeletedEvent: "DataNodeDeletedEvent"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
	DataNodeDeleted: "nodeDeleted",
	DataNodeInserted: "nodeInserted",
	DataNodeReplaced: "nodeReplaced"
});
OSF.DDA.CustomXmlParts=function OSF_DDA_CustomXmlParts() {
	this._eventDispatches=[];
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddDataPartAsync,
		am.GetDataPartByIdAsync,
		am.GetDataPartsByNameSpaceAsync
	]);
};
OSF.DDA.CustomXmlPart=function OSF_DDA_CustomXmlPart(customXmlParts, id, builtIn) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"builtIn": {
			value: builtIn
		},
		"id": {
			value: id
		},
		"namespaceManager": {
			value: new OSF.DDA.CustomXmlPrefixMappings(id)
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.DeleteDataPartAsync,
		am.GetPartNodesAsync,
		am.GetPartXmlAsync
	]);
	var customXmlPartEventDispatches=customXmlParts._eventDispatches;
	var dispatch=customXmlPartEventDispatches[id];
	if (!dispatch) {
		var et=Microsoft.Office.WebExtension.EventType;
		dispatch=new OSF.EventDispatch([
			et.DataNodeDeleted,
			et.DataNodeInserted,
			et.DataNodeReplaced
		]);
		customXmlPartEventDispatches[id]=dispatch;
	}
	OSF.DDA.DispIdHost.addEventSupport(this, dispatch);
};
OSF.DDA.CustomXmlPrefixMappings=function OSF_DDA_CustomXmlPrefixMappings(partId) {
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.AddDataPartNamespaceAsync,
		am.GetDataPartNamespaceAsync,
		am.GetDataPartPrefixAsync
	], partId);
};
OSF.DDA.CustomXmlNode=function OSF_DDA_CustomXmlNode(handle, nodeType, ns, baseName) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"baseName": {
			value: baseName
		},
		"namespaceUri": {
			value: ns
		},
		"nodeType": {
			value: nodeType
		}
	});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		am.GetRelativeNodesAsync,
		am.GetNodeValueAsync,
		am.GetNodeXmlAsync,
		am.SetNodeValueAsync,
		am.SetNodeXmlAsync,
		am.GetNodeTextAsync,
		am.SetNodeTextAsync
	], handle);
};
OSF.DDA.NodeInsertedEventArgs=function OSF_DDA_NodeInsertedEventArgs(newNode, inUndoRedo) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DataNodeInserted
		},
		"newNode": {
			value: newNode
		},
		"inUndoRedo": {
			value: inUndoRedo
		}
	});
};
OSF.DDA.NodeReplacedEventArgs=function OSF_DDA_NodeReplacedEventArgs(oldNode, newNode, inUndoRedo) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DataNodeReplaced
		},
		"oldNode": {
			value: oldNode
		},
		"newNode": {
			value: newNode
		},
		"inUndoRedo": {
			value: inUndoRedo
		}
	});
};
OSF.DDA.NodeDeletedEventArgs=function OSF_DDA_NodeDeletedEventArgs(oldNode, oldNextSibling, inUndoRedo) {
	OSF.OUtil.defineEnumerableProperties(this, {
		"type": {
			value: Microsoft.Office.WebExtension.EventType.DataNodeDeleted
		},
		"oldNode": {
			value: oldNode
		},
		"oldNextSibling": {
			value: oldNextSibling
		},
		"inUndoRedo": {
			value: inUndoRedo
		}
	});
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureDataNode=function OSF_DDA_OMFactory$manufactureDataNode(nodeProperties) {
	if (nodeProperties) {
		return new OSF.DDA.CustomXmlNode(nodeProperties[OSF.DDA.DataNodeProperties.Handle], nodeProperties[OSF.DDA.DataNodeProperties.NodeType], nodeProperties[OSF.DDA.DataNodeProperties.NamespaceUri], nodeProperties[OSF.DDA.DataNodeProperties.BaseName]);
	}
};
OSF.DDA.OMFactory.manufactureDataPart=function OSF_DDA_OMFactory$manufactureDataPart(partProperties, containingCustomXmlParts) {
	return new OSF.DDA.CustomXmlPart(containingCustomXmlParts, partProperties[OSF.DDA.DataPartProperties.Id], partProperties[OSF.DDA.DataPartProperties.BuiltIn]);
};
OSF.DDA.AsyncMethodNames.addNames({
	AddDataPartAsync: "addAsync",
	GetDataPartByIdAsync: "getByIdAsync",
	GetDataPartsByNameSpaceAsync: "getByNamespaceAsync",
	DeleteDataPartAsync: "deleteAsync",
	GetPartNodesAsync: "getNodesAsync",
	GetPartXmlAsync: "getXmlAsync",
	AddDataPartNamespaceAsync: "addNamespaceAsync",
	GetDataPartNamespaceAsync: "getNamespaceAsync",
	GetDataPartPrefixAsync: "getPrefixAsync",
	GetRelativeNodesAsync: "getNodesAsync",
	GetNodeValueAsync: "getNodeValueAsync",
	GetNodeXmlAsync: "getXmlAsync",
	SetNodeValueAsync: "setNodeValueAsync",
	SetNodeXmlAsync: "setXmlAsync",
	GetNodeTextAsync: "getTextAsync",
	SetNodeTextAsync: "setTextAsync"
});
(function () {
	function processDataPart(dataPartDescriptor) {
		return OSF.DDA.OMFactory.manufactureDataPart(dataPartDescriptor, Microsoft.Office.WebExtension.context.document.customXmlParts);
	}
	function processDataNode(dataNodeDescriptor) {
		return OSF.DDA.OMFactory.manufactureDataNode(dataNodeDescriptor);
	}
	function processData(dataDescriptor, caller, callArgs) {
		var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
		return data==undefined ? null : data;
	}
	function getObjectId(obj) { return obj.id; }
	function getPartId(part, partId) { return partId; }
	;
	function getNodeHandle(node, nodeHandle) { return nodeHandle; }
	;
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddDataPartAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Xml,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: processDataPart
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataPartByIdAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Id,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: processDataPart
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataPartsByNameSpaceAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Namespace,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataPartList], processDataPart); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.DeleteDataPartAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getObjectId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetPartNodesAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.XPath,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getObjectId
			}
		],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataNodeList], processDataNode); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetPartXmlAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getObjectId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.AddDataPartNamespaceAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Prefix,
				"types": ["string"]
			},
			{
				"name": Microsoft.Office.WebExtension.Parameters.Namespace,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getPartId
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataPartNamespaceAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Prefix,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getPartId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetDataPartPrefixAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Namespace,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataPartProperties.Id,
				value: getPartId
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetRelativeNodesAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.XPath,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		],
		onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataNodeList], processDataNode); }
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetNodeValueAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetNodeXmlAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetNodeValueAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Data,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetNodeXmlAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Xml,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		]
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.GetNodeTextAsync,
		requiredArguments: [],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		],
		onSucceeded: processData
	});
	OSF.DDA.AsyncMethodCalls.define({
		method: OSF.DDA.AsyncMethodNames.SetNodeTextAsync,
		requiredArguments: [
			{
				"name": Microsoft.Office.WebExtension.Parameters.Text,
				"types": ["string"]
			}
		],
		supportedOptions: [],
		privateStateCallbacks: [
			{
				name: OSF.DDA.DataNodeProperties.Handle,
				value: getNodeHandle
			}
		]
	});
})();
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.DataPartProperties,
	fromHost: [
		{ name: OSF.DDA.DataPartProperties.Id, value: 0 },
		{ name: OSF.DDA.DataPartProperties.BuiltIn, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.DataNodeProperties,
	fromHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 },
		{ name: OSF.DDA.DataNodeProperties.BaseName, value: 1 },
		{ name: OSF.DDA.DataNodeProperties.NamespaceUri, value: 2 },
		{ name: OSF.DDA.DataNodeProperties.NodeType, value: 3 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DataNodeInsertedEvent,
	fromHost: [
		{ name: OSF.DDA.DataNodeEventProperties.InUndoRedo, value: 0 },
		{ name: OSF.DDA.DataNodeEventProperties.NewNode, value: 1 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DataNodeReplacedEvent,
	fromHost: [
		{ name: OSF.DDA.DataNodeEventProperties.InUndoRedo, value: 0 },
		{ name: OSF.DDA.DataNodeEventProperties.OldNode, value: 1 },
		{ name: OSF.DDA.DataNodeEventProperties.NewNode, value: 2 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DataNodeDeletedEvent,
	fromHost: [
		{ name: OSF.DDA.DataNodeEventProperties.InUndoRedo, value: 0 },
		{ name: OSF.DDA.DataNodeEventProperties.OldNode, value: 1 },
		{ name: OSF.DDA.DataNodeEventProperties.NextSiblingNode, value: 2 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.DataNodeEventProperties.OldNode,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.DataNodeProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.DataNodeEventProperties.NewNode,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.DataNodeProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.DataNodeEventProperties.NextSiblingNode,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.DataNodeProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddDataPartMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.DataPartProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Xml, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataPartByIdMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.DataPartProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataPartsByNamespaceMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.DataPartList, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Namespace, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataPartXmlMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataPartNodesMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.DataNodeList, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.XPath, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidDeleteDataPartMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataNodeValueMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataNodeXmlMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataNodesMethod,
	fromHost: [
		{ name: OSF.DDA.ListDescriptors.DataNodeList, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.XPath, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetDataNodeValueMethod,
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetDataNodeXmlMethod,
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Xml, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidAddDataNamespaceMethod,
	toHost: [
		{ name: OSF.DDA.DataPartProperties.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Prefix, value: 1 },
		{ name: Microsoft.Office.WebExtension.Parameters.Namespace, value: 2 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataUriByPrefixMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataPartProperties.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Prefix, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataPrefixByUriMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataPartProperties.Id, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Namespace, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetDataNodeTextMethod,
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	],
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidSetDataNodeTextMethod,
	toHost: [
		{ name: OSF.DDA.DataNodeProperties.Handle, value: 0 },
		{ name: Microsoft.Office.WebExtension.Parameters.Text, value: 1 }
	]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDataNodeAddedEvent,
	fromHost: [{ name: OSF.DDA.EventDescriptors.DataNodeInsertedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDataNodeReplacedEvent,
	fromHost: [{ name: OSF.DDA.EventDescriptors.DataNodeReplacedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDataNodeDeletedEvent,
	fromHost: [{ name: OSF.DDA.EventDescriptors.DataNodeDeletedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor,
	fromHost: [
		{ name: OSF.DDA.FilePropertiesDescriptor.Url, value: 0 }
	],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidGetFilePropertiesMethod,
	fromHost: [
		{ name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.DDA.AsyncMethodNames.addNames({
	ExecuteRichApiRequestAsync: "executeRichApiRequestAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync,
	requiredArguments: [
		{
			name: Microsoft.Office.WebExtension.Parameters.Data,
			types: ["object"]
		}
	],
	supportedOptions: []
});
OSF.OUtil.setNamespace("RichApi", OSF.DDA);
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidExecuteRichApiRequestMethod,
	toHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: 0 }
	],
	fromHost: [
		{ name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
	]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Image: "image" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: Microsoft.Office.WebExtension.Parameters.CoercionType,
	toHost: [
		{ name: Microsoft.Office.WebExtension.CoercionType.Image, value: 8 }
	]
});
OSF.DDA.WordDocument=function OSF_DDA_WordDocument(officeAppContext, settings) {
	OSF.DDA.WordDocument.uber.constructor.call(this, officeAppContext, new OSF.DDA.BindingFacade(this), settings);
	OSF.DDA.DispIdHost.addAsyncMethods(this, [
		OSF.DDA.AsyncMethodNames.GoToByIdAsync,
		OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
		OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync
	]);
	OSF.OUtil.defineEnumerableProperty(this, "customXmlParts", {
		value: new OSF.DDA.CustomXmlParts()
	});
	OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.WordDocument, OSF.DDA.JsomDocument);
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM=function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
	OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
	appContext.doc=new OSF.DDA.WordDocument(appContext, this._initializeSettings(appContext, true));
	OSF.DDA.DispIdHost.addAsyncMethods(OSF.DDA.RichApi, [OSF.DDA.AsyncMethodNames.ExecuteRichApiRequestAsync]);
	appReady();
};

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var OfficeExtension;
(function (OfficeExtension) {
	var Action=(function () {
		function Action(actionInfo, isWriteOperation) {
			this.m_actionInfo=actionInfo;
			this.m_isWriteOperation=isWriteOperation;
		}
		Object.defineProperty(Action.prototype, "actionInfo", {
			get: function () {
				return this.m_actionInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Action.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			enumerable: true,
			configurable: true
		});
		return Action;
	}());
	OfficeExtension.Action=Action;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ActionFactory=(function () {
		function ActionFactory() {
		}
		ActionFactory.createSetPropertyAction=function (context, parent, propertyName, value) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 4,
				Name: propertyName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var args=[value];
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			var ret=new OfficeExtension.Action(actionInfo, true);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			return ret;
		};
		ActionFactory.createMethodAction=function (context, parent, methodName, operationType, args) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 3,
				Name: methodName,
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var referencedArgumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, actionInfo.ArgumentInfo, args);
			OfficeExtension.Utility.validateReferencedObjectPaths(referencedArgumentObjectPaths);
			var isWriteOperation=operationType !=1;
			var ret=new OfficeExtension.Action(actionInfo, isWriteOperation);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			context._pendingRequest.addReferencedObjectPaths(referencedArgumentObjectPaths);
			return ret;
		};
		ActionFactory.createQueryAction=function (context, parent, queryOption) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 2,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			actionInfo.QueryInfo=queryOption;
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			return ret;
		};
		ActionFactory.createRecursiveQueryAction=function (context, parent, query) {
			OfficeExtension.Utility.validateObjectPath(parent);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 6,
				Name: "",
				ObjectPathId: parent._objectPath.objectPathInfo.Id,
				RecursiveQueryInfo: query
			};
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(parent._objectPath);
			return ret;
		};
		ActionFactory.createInstantiateAction=function (context, obj) {
			OfficeExtension.Utility.validateObjectPath(obj);
			var actionInfo={
				Id: context._nextId(),
				ActionType: 1,
				Name: "",
				ObjectPathId: obj._objectPath.objectPathInfo.Id
			};
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			context._pendingRequest.addReferencedObjectPath(obj._objectPath);
			context._pendingRequest.addActionResultHandler(ret, new OfficeExtension.InstantiateActionResultHandler(obj));
			return ret;
		};
		ActionFactory.createTraceAction=function (context, message, addTraceMessage) {
			var actionInfo={
				Id: context._nextId(),
				ActionType: 5,
				Name: "Trace",
				ObjectPathId: 0
			};
			var ret=new OfficeExtension.Action(actionInfo, false);
			context._pendingRequest.addAction(ret);
			if (addTraceMessage) {
				context._pendingRequest.addTrace(actionInfo.Id, message);
			}
			return ret;
		};
		return ActionFactory;
	}());
	OfficeExtension.ActionFactory=ActionFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientObject=(function () {
		function ClientObject(context, objectPath) {
			OfficeExtension.Utility.checkArgumentNull(context, "context");
			this.m_context=context;
			this.m_objectPath=objectPath;
			if (this.m_objectPath) {
				if (!context._processingResult) {
					OfficeExtension.ActionFactory.createInstantiateAction(context, this);
					if ((context._autoCleanup) && (this._KeepReference)) {
						context.trackedObjects._autoAdd(this);
					}
				}
			}
		}
		Object.defineProperty(ClientObject.prototype, "context", {
			get: function () {
				return this.m_context;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_objectPath", {
			get: function () {
				return this.m_objectPath;
			},
			set: function (value) {
				this.m_objectPath=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "isNull", {
			get: function () {
				OfficeExtension.Utility.throwIfNotLoaded("isNull", this._isNull, null, this._isNull);
				return this._isNull;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "isNullObject", {
			get: function () {
				OfficeExtension.Utility.throwIfNotLoaded("isNullObject", this._isNull, null, this._isNull);
				return this._isNull;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientObject.prototype, "_isNull", {
			get: function () {
				return this.m_isNull;
			},
			set: function (value) {
				this.m_isNull=value;
				if (value && this.m_objectPath) {
					this.m_objectPath._updateAsNullObject();
				}
			},
			enumerable: true,
			configurable: true
		});
		ClientObject.prototype._handleResult=function (value) {
			this._isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			this.context.trackedObjects._autoTrackIfNecessaryWhenHandleObjectResultValue(this, value);
		};
		ClientObject.prototype._handleIdResult=function (value) {
			this._isNull=OfficeExtension.Utility.isNullOrUndefined(value);
			OfficeExtension.Utility.fixObjectPathIfNecessary(this, value);
			this.context.trackedObjects._autoTrackIfNecessaryWhenHandleObjectResultValue(this, value);
		};
		ClientObject.prototype._recursivelySet=function (input, options, scalarWriteablePropertyNames, objectPropertyNames, notAllowedToBeSetPropertyNames) {
			var isClientObject=(input instanceof ClientObject);
			if (isClientObject) {
				if (Object.getPrototypeOf(this)===Object.getPrototypeOf(input)) {
					input=JSON.parse(JSON.stringify(input));
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError({
						argumentName: 'properties',
						errorLocation: this._className+".set"
					});
				}
			}
			try {
				var prop;
				for (var i=0; i < scalarWriteablePropertyNames.length; i++) {
					prop=scalarWriteablePropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						this[prop]=input[prop];
					}
				}
				for (var i=0; i < objectPropertyNames.length; i++) {
					prop=objectPropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						this[prop].set(input[prop], options);
					}
				}
				for (var i=0; i < notAllowedToBeSetPropertyNames.length; i++) {
					prop=notAllowedToBeSetPropertyNames[i];
					if (input.hasOwnProperty(prop)) {
						throw new OfficeExtension._Internal.RuntimeError({
							code: OfficeExtension.ErrorCodes.invalidArgument,
							message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.cannotApplyPropertyThroughSetMethod, prop),
							debugInfo: {
								errorLocation: prop
							}
						});
					}
				}
				var throwOnReadOnly=!isClientObject;
				if (options && !OfficeExtension.Utility.isNullOrUndefined(throwOnReadOnly)) {
					throwOnReadOnly=options.throwOnReadOnly;
				}
				for (prop in input) {
					if (scalarWriteablePropertyNames.indexOf(prop) < 0 && objectPropertyNames.indexOf(prop) < 0) {
						var propertyDescriptor=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), prop);
						if (!propertyDescriptor) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.propertyDoesNotExist, prop),
								debugInfo: {
									errorLocation: prop
								}
							});
						}
						if (throwOnReadOnly && !propertyDescriptor.set) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidArgument,
								message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.attemptingToSetReadOnlyProperty, prop),
								debugInfo: {
									errorLocation: prop
								}
							});
						}
					}
				}
			}
			catch (innerError) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidArgument,
					message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgument, 'properties'),
					debugInfo: {
						errorLocation: this._className+".set"
					},
					innerError: innerError
				});
			}
		};
		return ClientObject;
	}());
	OfficeExtension.ClientObject=ClientObject;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientRequest=(function () {
		function ClientRequest(context) {
			this.m_context=context;
			this.m_actions=[];
			this.m_actionResultHandler={};
			this.m_referencedObjectPaths={};
			this.m_flags=0;
			this.m_traceInfos={};
			this.m_pendingProcessEventHandlers=[];
			this.m_pendingEventHandlerActions={};
			this.m_responseTraceIds={};
			this.m_responseTraceMessages=[];
		}
		Object.defineProperty(ClientRequest.prototype, "flags", {
			get: function () {
				return this.m_flags;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "traceInfos", {
			get: function () {
				return this.m_traceInfos;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_responseTraceMessages", {
			get: function () {
				return this.m_responseTraceMessages;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequest.prototype, "_responseTraceIds", {
			get: function () {
				return this.m_responseTraceIds;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype._setResponseTraceIds=function (value) {
			if (value) {
				for (var i=0; i < value.length; i++) {
					var traceId=value[i];
					this.m_responseTraceIds[traceId]=traceId;
					var message=this.m_traceInfos[traceId];
					if (!OfficeExtension.Utility.isNullOrUndefined(message)) {
						this.m_responseTraceMessages.push(message);
					}
				}
			}
		};
		ClientRequest.prototype.addAction=function (action) {
			if (action.isWriteOperation) {
				this.m_flags=this.m_flags | 1;
			}
			this.m_actions.push(action);
		};
		Object.defineProperty(ClientRequest.prototype, "hasActions", {
			get: function () {
				return this.m_actions.length > 0;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype.addTrace=function (actionId, message) {
			this.m_traceInfos[actionId]=message;
		};
		ClientRequest.prototype.addReferencedObjectPath=function (objectPath) {
			if (this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]) {
				return;
			}
			if (!objectPath.isValid) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidObjectPath,
					message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, OfficeExtension.Utility.getObjectPathExpression(objectPath)),
					debugInfo: {
						errorLocation: OfficeExtension.Utility.getObjectPathExpression(objectPath)
					}
				});
			}
			while (objectPath) {
				if (objectPath.isWriteOperation) {
					this.m_flags=this.m_flags | 1;
				}
				this.m_referencedObjectPaths[objectPath.objectPathInfo.Id]=objectPath;
				if (objectPath.objectPathInfo.ObjectPathType==3) {
					this.addReferencedObjectPaths(objectPath.argumentObjectPaths);
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		ClientRequest.prototype.addReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					this.addReferencedObjectPath(objectPaths[i]);
				}
			}
		};
		ClientRequest.prototype.addActionResultHandler=function (action, resultHandler) {
			this.m_actionResultHandler[action.actionInfo.Id]=resultHandler;
		};
		ClientRequest.prototype.buildRequestMessageBody=function () {
			var objectPaths={};
			for (var i in this.m_referencedObjectPaths) {
				objectPaths[i]=this.m_referencedObjectPaths[i].objectPathInfo;
			}
			var actions=[];
			for (var index=0; index < this.m_actions.length; index++) {
				actions.push(this.m_actions[index].actionInfo);
			}
			var ret={
				AutoKeepReference: this.m_context._autoCleanup,
				Actions: actions,
				ObjectPaths: objectPaths
			};
			return ret;
		};
		ClientRequest.prototype.processResponse=function (actionResults) {
			if (actionResults) {
				for (var i=0; i < actionResults.length; i++) {
					var actionResult=actionResults[i];
					var handler=this.m_actionResultHandler[actionResult.ActionId];
					if (handler) {
						handler._handleResult(actionResult.Value);
					}
				}
			}
		};
		ClientRequest.prototype.invalidatePendingInvalidObjectPaths=function () {
			for (var i in this.m_referencedObjectPaths) {
				if (this.m_referencedObjectPaths[i].isInvalidAfterRequest) {
					this.m_referencedObjectPaths[i].isValid=false;
				}
			}
		};
		ClientRequest.prototype._addPendingEventHandlerAction=function (eventHandlers, action) {
			if (!this.m_pendingEventHandlerActions[eventHandlers._id]) {
				this.m_pendingEventHandlerActions[eventHandlers._id]=[];
				this.m_pendingProcessEventHandlers.push(eventHandlers);
			}
			this.m_pendingEventHandlerActions[eventHandlers._id].push(action);
		};
		Object.defineProperty(ClientRequest.prototype, "_pendingProcessEventHandlers", {
			get: function () {
				return this.m_pendingProcessEventHandlers;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequest.prototype._getPendingEventHandlerActions=function (eventHandlers) {
			return this.m_pendingEventHandlerActions[eventHandlers._id];
		};
		return ClientRequest;
	}());
	OfficeExtension.ClientRequest=ClientRequest;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var SessionBase=(function () {
		function SessionBase() {
		}
		SessionBase.prototype._resolveRequestUrlAndHeaderInfo=function () {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		SessionBase.prototype._createRequestExecutorOrNull=function () {
			return null;
		};
		Object.defineProperty(SessionBase.prototype, "eventRegistration", {
			get: function () {
				return OfficeExtension._Internal.officeJsEventRegistration;
			},
			enumerable: true,
			configurable: true
		});
		return SessionBase;
	}());
	OfficeExtension.SessionBase=SessionBase;
	var ClientRequestContext=(function () {
		function ClientRequestContext(url) {
			this.m_customRequestHeaders={};
			this._onRunFinishedNotifiers=[];
			this.m_nextId=0;
			if (ClientRequestContext._overrideSession) {
				this.m_requestUrlAndHeaderInfoResolver=ClientRequestContext._overrideSession;
			}
			else {
				if (OfficeExtension.Utility.isNullOrUndefined(url) || typeof (url)==="string" && url.length===0) {
					url=ClientRequestContext.defaultRequestUrlAndHeaders;
					if (!url) {
						url={ url: OfficeExtension.Constants.localDocument, headers: {} };
					}
				}
				if (typeof (url)==="string") {
					this.m_requestUrlAndHeaderInfo={ url: url, headers: {} };
				}
				else if (ClientRequestContext.isRequestUrlAndHeaderInfoResolver(url)) {
					this.m_requestUrlAndHeaderInfoResolver=url;
				}
				else if (ClientRequestContext.isRequestUrlAndHeaderInfo(url)) {
					var requestInfo=url;
					this.m_requestUrlAndHeaderInfo={ url: requestInfo.url, headers: {} };
					OfficeExtension.Utility._copyHeaders(requestInfo.headers, this.m_requestUrlAndHeaderInfo.headers);
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("url");
				}
			}
			if (this.m_requestUrlAndHeaderInfoResolver instanceof SessionBase) {
				this.m_session=this.m_requestUrlAndHeaderInfoResolver;
			}
			this._processingResult=false;
			this._customData=OfficeExtension.Constants.iterativeExecutor;
			this.sync=this.sync.bind(this);
		}
		Object.defineProperty(ClientRequestContext.prototype, "session", {
			get: function () {
				return this.m_session;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "eventRegistration", {
			get: function () {
				if (this.m_session) {
					return this.m_session.eventRegistration;
				}
				return OfficeExtension._Internal.officeJsEventRegistration;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "_url", {
			get: function () {
				if (this.m_requestUrlAndHeaderInfo) {
					return this.m_requestUrlAndHeaderInfo.url;
				}
				return null;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "_pendingRequest", {
			get: function () {
				if (this.m_pendingRequest==null) {
					this.m_pendingRequest=new OfficeExtension.ClientRequest(this);
				}
				return this.m_pendingRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "trackedObjects", {
			get: function () {
				if (!this.m_trackedObjects) {
					this.m_trackedObjects=new OfficeExtension.TrackedObjects(this);
				}
				return this.m_trackedObjects;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ClientRequestContext.prototype, "requestHeaders", {
			get: function () {
				return this.m_customRequestHeaders;
			},
			enumerable: true,
			configurable: true
		});
		ClientRequestContext.prototype.load=function (clientObj, option) {
			OfficeExtension.Utility.validateContext(this, clientObj);
			var queryOption=ClientRequestContext.parseQueryOption(option);
			var action=OfficeExtension.ActionFactory.createQueryAction(this, clientObj, queryOption);
			this._pendingRequest.addActionResultHandler(action, clientObj);
		};
		ClientRequestContext.parseQueryOption=function (option) {
			var queryOption={};
			if (typeof (option)=="string") {
				var select=option;
				queryOption.Select=OfficeExtension.Utility._parseSelectExpand(select);
			}
			else if (Array.isArray(option)) {
				queryOption.Select=option;
			}
			else if (typeof (option)=="object") {
				var loadOption=option;
				if (typeof (loadOption.select)=="string") {
					queryOption.Select=OfficeExtension.Utility._parseSelectExpand(loadOption.select);
				}
				else if (Array.isArray(loadOption.select)) {
					queryOption.Select=loadOption.select;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.select)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.select");
				}
				if (typeof (loadOption.expand)=="string") {
					queryOption.Expand=OfficeExtension.Utility._parseSelectExpand(loadOption.expand);
				}
				else if (Array.isArray(loadOption.expand)) {
					queryOption.Expand=loadOption.expand;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.expand)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.expand");
				}
				if (typeof (loadOption.top)=="number") {
					queryOption.Top=loadOption.top;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.top)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.top");
				}
				if (typeof (loadOption.skip)=="number") {
					queryOption.Skip=loadOption.skip;
				}
				else if (!OfficeExtension.Utility.isNullOrUndefined(loadOption.skip)) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option.skip");
				}
			}
			else if (!OfficeExtension.Utility.isNullOrUndefined(option)) {
				OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "option");
			}
			return queryOption;
		};
		ClientRequestContext.prototype.loadRecursive=function (clientObj, options, maxDepth) {
			if (!OfficeExtension.Utility.isPlainJsonObject(options)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("options");
			}
			var quries={};
			for (var key in options) {
				quries[key]=ClientRequestContext.parseQueryOption(options[key]);
			}
			var action=OfficeExtension.ActionFactory.createRecursiveQueryAction(this, clientObj, { Queries: quries, MaxDepth: maxDepth });
			this._pendingRequest.addActionResultHandler(action, clientObj);
		};
		ClientRequestContext.prototype.trace=function (message) {
			OfficeExtension.ActionFactory.createTraceAction(this, message, true);
		};
		ClientRequestContext.prototype.syncPrivateMain=function () {
			var _this=this;
			return OfficeExtension.Utility._createPromiseFromResult(null)
				.then(function () {
				if (!_this.m_requestUrlAndHeaderInfo) {
					return _this.m_requestUrlAndHeaderInfoResolver._resolveRequestUrlAndHeaderInfo()
						.then(function (value) {
						_this.m_requestUrlAndHeaderInfo=value;
						if (!_this.m_requestUrlAndHeaderInfo) {
							_this.m_requestUrlAndHeaderInfo={ url: OfficeExtension.Constants.localDocument, headers: {} };
						}
						if (OfficeExtension.Utility.isNullOrEmptyString(_this.m_requestUrlAndHeaderInfo.url)) {
							_this.m_requestUrlAndHeaderInfo.url=OfficeExtension.Constants.localDocument;
						}
						if (!_this.m_requestUrlAndHeaderInfo.headers) {
							_this.m_requestUrlAndHeaderInfo.headers={};
						}
						if (typeof (_this.m_requestUrlAndHeaderInfoResolver._createRequestExecutorOrNull)==="function") {
							var executor=_this.m_requestUrlAndHeaderInfoResolver._createRequestExecutorOrNull();
							if (executor) {
								_this._requestExecutor=executor;
							}
						}
					});
				}
			})
				.then(function () {
				return _this.syncPrivate();
			});
		};
		ClientRequestContext.prototype.syncPrivate=function () {
			var _this=this;
			var req=this._pendingRequest;
			this.m_pendingRequest=null;
			if (!req.hasActions) {
				return this.processPendingEventHandlers(req);
			}
			var msgBody=req.buildRequestMessageBody();
			var requestFlags=req.flags;
			if (!this._requestExecutor) {
				if (OfficeExtension.Utility._isLocalDocumentUrl(this.m_requestUrlAndHeaderInfo.url)) {
					this._requestExecutor=new OfficeExtension.OfficeJsRequestExecutor();
				}
				else {
					this._requestExecutor=new OfficeExtension.HttpRequestExecutor();
				}
			}
			var requestExecutor=this._requestExecutor;
			var headers={};
			OfficeExtension.Utility._copyHeaders(this.m_requestUrlAndHeaderInfo.headers, headers);
			OfficeExtension.Utility._copyHeaders(this.m_customRequestHeaders, headers);
			var requestExecutorRequestMessage={
				Url: this.m_requestUrlAndHeaderInfo.url,
				Headers: headers,
				Body: msgBody
			};
			req.invalidatePendingInvalidObjectPaths();
			var errorFromResponse=null;
			var errorFromProcessEventHandlers=null;
			return requestExecutor.executeAsync(this._customData, requestFlags, requestExecutorRequestMessage)
				.then(function (response) {
				errorFromResponse=_this.processRequestExecutorResponseMessage(req, response);
				return _this.processPendingEventHandlers(req)
					.catch(function (ex) {
					OfficeExtension.Utility.log("Error in processPendingEventHandlers");
					OfficeExtension.Utility.log(JSON.stringify(ex));
					errorFromProcessEventHandlers=ex;
				});
			})
				.then(function () {
				if (errorFromResponse) {
					OfficeExtension.Utility.log("Throw error from response: "+JSON.stringify(errorFromResponse));
					throw errorFromResponse;
				}
				if (errorFromProcessEventHandlers) {
					OfficeExtension.Utility.log("Throw error from ProcessEventHandler: "+JSON.stringify(errorFromProcessEventHandlers));
					var transformedError=null;
					if (errorFromProcessEventHandlers instanceof OfficeExtension._Internal.RuntimeError) {
						transformedError=errorFromProcessEventHandlers;
						transformedError.traceMessages=req._responseTraceMessages;
					}
					else {
						var message=null;
						if (typeof (errorFromProcessEventHandlers)==="string") {
							message=errorFromProcessEventHandlers;
						}
						else {
							message=errorFromProcessEventHandlers.message;
						}
						if (OfficeExtension.Utility.isNullOrEmptyString(message)) {
							message=OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.cannotRegisterEvent);
						}
						transformedError=new OfficeExtension._Internal.RuntimeError({
							code: OfficeExtension.ErrorCodes.cannotRegisterEvent,
							message: message,
							traceMessages: req._responseTraceMessages
						});
					}
					throw transformedError;
				}
			});
		};
		ClientRequestContext.prototype.processRequestExecutorResponseMessage=function (req, response) {
			if (response.Body && response.Body.TraceIds) {
				req._setResponseTraceIds(response.Body.TraceIds);
			}
			var traceMessages=req._responseTraceMessages;
			if (response.Body) {
				var actionResults=null;
				if (response.Body.Results) {
					actionResults=response.Body.Results;
				}
				else if (response.Body.ProcessedResults && response.Body.ProcessedResults.Results) {
					actionResults=response.Body.ProcessedResults.Results;
				}
				if (actionResults) {
					this._processingResult=true;
					try {
						req.processResponse(actionResults);
					}
					finally {
						this._processingResult=false;
					}
				}
			}
			if (!OfficeExtension.Utility.isNullOrEmptyString(response.ErrorCode)) {
				return new OfficeExtension._Internal.RuntimeError({
					code: response.ErrorCode,
					message: response.ErrorMessage,
					traceMessages: traceMessages
				});
			}
			else if (response.Body && response.Body.Error) {
				return new OfficeExtension._Internal.RuntimeError({
					code: response.Body.Error.Code,
					message: response.Body.Error.Message,
					traceMessages: traceMessages,
					debugInfo: {
						errorLocation: response.Body.Error.Location
					}
				});
			}
			return null;
		};
		ClientRequestContext.prototype.processPendingEventHandlers=function (req) {
			var ret=OfficeExtension.Utility._createPromiseFromResult(null);
			for (var i=0; i < req._pendingProcessEventHandlers.length; i++) {
				var eventHandlers=req._pendingProcessEventHandlers[i];
				ret=ret.then(this.createProcessOneEventHandlersFunc(eventHandlers, req));
			}
			return ret;
		};
		ClientRequestContext.prototype.createProcessOneEventHandlersFunc=function (eventHandlers, req) {
			return function () { return eventHandlers._processRegistration(req); };
		};
		ClientRequestContext.prototype.sync=function (passThroughValue) {
			return this.syncPrivateMain().then(function () { return passThroughValue; });
		};
		ClientRequestContext._run=function (ctxInitializer, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (numCleanupAttempts===void 0) { numCleanupAttempts=3; }
			if (retryDelay===void 0) { retryDelay=5000; }
			return ClientRequestContext._runCommon("run", null, ctxInitializer, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure);
		};
		ClientRequestContext.isRequestUrlAndHeaderInfo=function (value) {
			return (typeof (value)==="object" &&
				value !==null &&
				Object.getPrototypeOf(value)===Object.getPrototypeOf({}) &&
				!OfficeExtension.Utility.isNullOrUndefined(value.url));
		};
		ClientRequestContext.isRequestUrlAndHeaderInfoResolver=function (value) {
			return (typeof (value)==="object" &&
				value !==null &&
				typeof (value._resolveRequestUrlAndHeaderInfo)==="function");
		};
		ClientRequestContext._runBatch=function (functionName, receivedRunArgs, ctxInitializer, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (numCleanupAttempts===void 0) { numCleanupAttempts=3; }
			if (retryDelay===void 0) { retryDelay=5000; }
			var ctxRetriever;
			var batch;
			var requestInfo=null;
			var argOffset=0;
			if (receivedRunArgs.length > 0 &&
				(typeof (receivedRunArgs[0])==="string" ||
					ClientRequestContext.isRequestUrlAndHeaderInfo(receivedRunArgs[0]) ||
					ClientRequestContext.isRequestUrlAndHeaderInfoResolver(receivedRunArgs[0]))) {
				requestInfo=receivedRunArgs[0];
				argOffset=1;
			}
			if (receivedRunArgs.length==argOffset+1) {
				ctxRetriever=ctxInitializer;
				batch=receivedRunArgs[argOffset+0];
			}
			else if (receivedRunArgs.length==argOffset+2) {
				if (receivedRunArgs[argOffset+0] instanceof OfficeExtension.ClientObject) {
					ctxRetriever=function () { return receivedRunArgs[argOffset+0].context; };
				}
				else if (Array.isArray(receivedRunArgs[argOffset+0])) {
					var array=receivedRunArgs[argOffset+0];
					if (array.length==0) {
						return ClientRequestContext.createErrorPromise(functionName);
					}
					for (var i=0; i < array.length; i++) {
						if (!(array[i] instanceof OfficeExtension.ClientObject)) {
							return ClientRequestContext.createErrorPromise(functionName);
						}
						if (array[i].context !=array[0].context) {
							return ClientRequestContext.createErrorPromise(functionName, OfficeExtension.ResourceStrings.invalidRequestContext);
						}
					}
					ctxRetriever=function () { return array[0].context; };
				}
				else {
					return ClientRequestContext.createErrorPromise(functionName);
				}
				batch=receivedRunArgs[argOffset+1];
			}
			else {
				return ClientRequestContext.createErrorPromise(functionName);
			}
			return ClientRequestContext._runCommon(functionName, requestInfo, ctxRetriever, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure);
		};
		ClientRequestContext.createErrorPromise=function (functionName, code) {
			if (code===void 0) { code=OfficeExtension.ResourceStrings.invalidArgument; }
			return OfficeExtension._Internal.OfficePromise.reject(OfficeExtension.Utility.createRuntimeError(code, OfficeExtension.Utility._getResourceString(code), functionName));
		};
		ClientRequestContext._runCommon=function (functionName, requestInfo, ctxRetriever, batch, numCleanupAttempts, retryDelay, onCleanupSuccess, onCleanupFailure) {
			if (ClientRequestContext._overrideSession) {
				requestInfo=ClientRequestContext._overrideSession;
			}
			var starterPromise=new OfficeExtension._Internal.OfficePromise(function (resolve, reject) { resolve(); });
			var ctx;
			var succeeded=false;
			var resultOrError;
			return starterPromise
				.then(function () {
				ctx=ctxRetriever(requestInfo);
				if (ctx._autoCleanup) {
					return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
						ctx._onRunFinishedNotifiers.push(function () {
							ctx._autoCleanup=true;
							resolve();
						});
					});
				}
				else {
					ctx._autoCleanup=true;
				}
			})
				.then(function () {
				if (typeof batch !=='function') {
					return ClientRequestContext.createErrorPromise(functionName);
				}
				var batchResult=batch(ctx);
				if (OfficeExtension.Utility.isNullOrUndefined(batchResult) || (typeof batchResult.then !=='function')) {
					OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.runMustReturnPromise);
				}
				return batchResult;
			})
				.then(function (batchResult) {
				return ctx.sync(batchResult);
			})
				.then(function (result) {
				succeeded=true;
				resultOrError=result;
			})
				.catch(function (error) {
				resultOrError=error;
			})
				.then(function () {
				var itemsToRemove=ctx.trackedObjects._retrieveAndClearAutoCleanupList();
				ctx._autoCleanup=false;
				for (var key in itemsToRemove) {
					itemsToRemove[key]._objectPath.isValid=false;
				}
				var cleanupCounter=0;
				if (OfficeExtension.Utility._synchronousCleanup || ClientRequestContext.isRequestUrlAndHeaderInfoResolver(requestInfo)) {
					return attemptCleanup();
				}
				else {
					attemptCleanup();
				}
				function attemptCleanup() {
					cleanupCounter++;
					for (var key in itemsToRemove) {
						ctx.trackedObjects.remove(itemsToRemove[key]);
					}
					return ctx.sync()
						.then(function () {
						if (onCleanupSuccess) {
							onCleanupSuccess(cleanupCounter);
						}
					})
						.catch(function () {
						if (onCleanupFailure) {
							onCleanupFailure(cleanupCounter);
						}
						if (cleanupCounter < numCleanupAttempts) {
							setTimeout(function () {
								attemptCleanup();
							}, retryDelay);
						}
					});
				}
			})
				.then(function () {
				if (ctx._onRunFinishedNotifiers && ctx._onRunFinishedNotifiers.length > 0) {
					var func=ctx._onRunFinishedNotifiers.shift();
					func();
				}
				if (succeeded) {
					return resultOrError;
				}
				else {
					throw resultOrError;
				}
			});
		};
		ClientRequestContext.prototype._nextId=function () {
			return++this.m_nextId;
		};
		return ClientRequestContext;
	}());
	OfficeExtension.ClientRequestContext=ClientRequestContext;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ClientResult=(function () {
		function ClientResult(type) {
			this.m_type=type;
		}
		Object.defineProperty(ClientResult.prototype, "value", {
			get: function () {
				if (!this.m_isLoaded) {
					throw new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.valueNotLoaded,
						message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.valueNotLoaded),
						debugInfo: {
							errorLocation: "clientResult.value"
						}
					});
				}
				return this.m_value;
			},
			enumerable: true,
			configurable: true
		});
		ClientResult.prototype._handleResult=function (value) {
			this.m_isLoaded=true;
			if (typeof (value)==="object" && value && value._IsNull) {
				return;
			}
			if (this.m_type===1) {
				this.m_value=OfficeExtension.Utility.adjustToDateTime(value);
			}
			else {
				this.m_value=value;
			}
		};
		return ClientResult;
	}());
	OfficeExtension.ClientResult=ClientResult;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Constants=(function () {
		function Constants() {
		}
		Constants.flags="flags";
		Constants.getItemAt="GetItemAt";
		Constants.id="Id";
		Constants.idPrivate="_Id";
		Constants.index="_Index";
		Constants.items="_Items";
		Constants.iterativeExecutor="IterativeExecutor";
		Constants.localDocument="http://document.localhost/";
		Constants.localDocumentApiPrefix="http://document.localhost/_api/";
		Constants.processQuery="ProcessQuery";
		Constants.referenceId="_ReferenceId";
		Constants.isTracked="_IsTracked";
		Constants.sourceLibHeader="SdkVersion";
		Constants.embeddingPageOrigin="EmbeddingPageOrigin";
		Constants.embeddingPageSessionInfo="EmbeddingPageSessionInfo";
		return Constants;
	}());
	OfficeExtension.Constants=Constants;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var versionToken=1;
	var internalConfiguration={
		invokeRequestModifier: function (request) {
			request.DdaMethod.Version=versionToken;
			return request;
		},
		invokeResponseModifier: function (args) {
			versionToken=args.Version;
			if (args.Error) {
				args.error={};
				args.error.Code=args.Error;
			}
			return args;
		}
	};
	var EmbeddedApiStatus;
	(function (EmbeddedApiStatus) {
		EmbeddedApiStatus[EmbeddedApiStatus["Success"]=0]="Success";
		EmbeddedApiStatus[EmbeddedApiStatus["Timeout"]=1]="Timeout";
		EmbeddedApiStatus[EmbeddedApiStatus["InternalError"]=5001]="InternalError";
	})(EmbeddedApiStatus || (EmbeddedApiStatus={}));
	var CommunicationConstants;
	(function (CommunicationConstants) {
		CommunicationConstants.SendingId="sId";
		CommunicationConstants.RespondingId="rId";
		CommunicationConstants.CommandKey="command";
		CommunicationConstants.SessionInfoKey="sessionInfo";
		CommunicationConstants.ParamsKey="params";
		CommunicationConstants.ApiReadyCommand="apiready";
		CommunicationConstants.ExecuteMethodCommand="executeMethod";
		CommunicationConstants.GetAppContextCommand="getAppContext";
		CommunicationConstants.RegisterEventCommand="registerEvent";
		CommunicationConstants.UnregisterEventCommand="unregisterEvent";
		CommunicationConstants.FireEventCommand="fireEvent";
	})(CommunicationConstants || (CommunicationConstants={}));
	var EmbeddedSession=(function (_super) {
		__extends(EmbeddedSession, _super);
		function EmbeddedSession(url, options) {
			_super.call(this);
			this.m_chosenWindow=null;
			this.m_chosenOrigin=null;
			this.m_enabled=true;
			this.m_onMessageHandler=this._onMessage.bind(this);
			this.m_callbackList={};
			this.m_id=0;
			this.m_timeoutId=-1;
			this.m_appContext=null;
			this.m_url=url;
			this.m_options=options;
			if (!this.m_options) {
				this.m_options={ sessionKey: Math.random().toString() };
			}
			if (!this.m_options.sessionKey) {
				this.m_options.sessionKey=Math.random().toString();
			}
			if (!this.m_options.container) {
				this.m_options.container=document.body;
			}
			if (!this.m_options.timeoutInMilliseconds) {
				this.m_options.timeoutInMilliseconds=60000;
			}
			if (!this.m_options.height) {
				this.m_options.height="400px";
			}
			if (!this.m_options.width) {
				this.m_options.width="100%";
			}
		}
		EmbeddedSession.prototype._getIFrameSrc=function () {
			var origin=window.location.protocol+"//"+window.location.host;
			var toAppend=OfficeExtension.Constants.embeddingPageOrigin+"="+encodeURIComponent(origin)+"&"+OfficeExtension.Constants.embeddingPageSessionInfo+"="+encodeURIComponent(this.m_options.sessionKey);
			var useHash=false;
			if (this.m_url.toLowerCase().indexOf("/_layouts/preauth.aspx") > 0) {
				useHash=true;
			}
			var a=document.createElement("a");
			a.href=this.m_url;
			if (useHash) {
				if (a.hash.length===0 || a.hash==="#") {
					a.hash="#"+toAppend;
				}
				else {
					a.hash=a.hash+"&"+toAppend;
				}
			}
			else {
				if (a.search.length===0 || a.search==="?") {
					a.search="?"+toAppend;
				}
				else {
					a.search=a.search+"&"+toAppend;
				}
			}
			var iframeSrc=a.href;
			return iframeSrc;
		};
		EmbeddedSession.prototype.init=function () {
			var _this=this;
			window.addEventListener("message", this.m_onMessageHandler);
			var iframeSrc=this._getIFrameSrc();
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				var iframeElement=document.createElement("iframe");
				if (_this.m_options.id) {
					iframeElement.id=_this.m_options.id;
				}
				iframeElement.style.height=_this.m_options.height;
				iframeElement.style.width=_this.m_options.width;
				iframeElement.src=iframeSrc;
				_this.m_options.container.appendChild(iframeElement);
				_this.m_timeoutId=setTimeout(function () {
					_this.close();
					var err=OfficeExtension.Utility.createRuntimeError(OfficeExtension.ErrorCodes.timeout, OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.timeout), "EmbeddedSession.init");
					reject(err);
				}, _this.m_options.timeoutInMilliseconds);
				_this.m_promiseResolver=resolve;
			});
		};
		EmbeddedSession.prototype._invoke=function (method, callback, params) {
			if (!this.m_enabled) {
				callback(EmbeddedApiStatus.InternalError, null);
				return;
			}
			if (internalConfiguration.invokeRequestModifier) {
				params=internalConfiguration.invokeRequestModifier(params);
			}
			this._sendMessageWithCallback(this.m_id++, method, params, function (args) {
				if (internalConfiguration.invokeResponseModifier) {
					args=internalConfiguration.invokeResponseModifier(args);
				}
				var errorCode=args["Error"];
				delete args["Error"];
				callback(errorCode || EmbeddedApiStatus.Success, args);
			});
		};
		EmbeddedSession.prototype.close=function () {
			window.removeEventListener("message", this.m_onMessageHandler);
			window.clearTimeout(this.m_timeoutId);
			this.m_enabled=false;
		};
		Object.defineProperty(EmbeddedSession.prototype, "eventRegistration", {
			get: function () {
				if (!this.m_sessionEventManager) {
					this.m_sessionEventManager=new OfficeExtension.EventRegistration(this._registerEventImpl.bind(this), this._unregisterEventImpl.bind(this));
				}
				return this.m_sessionEventManager;
			},
			enumerable: true,
			configurable: true
		});
		EmbeddedSession.prototype._createRequestExecutorOrNull=function () {
			return new EmbeddedRequestExecutor(this);
		};
		EmbeddedSession.prototype._resolveRequestUrlAndHeaderInfo=function () {
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		EmbeddedSession.prototype._registerEventImpl=function (eventId, targetId) {
			var _this=this;
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this._sendMessageWithCallback(_this.m_id++, CommunicationConstants.RegisterEventCommand, { EventId: eventId, TargetId: targetId }, function () {
					resolve(null);
				});
			});
		};
		EmbeddedSession.prototype._unregisterEventImpl=function (eventId, targetId) {
			var _this=this;
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this._sendMessageWithCallback(_this.m_id++, CommunicationConstants.UnregisterEventCommand, { EventId: eventId, TargetId: targetId }, function () {
					resolve();
				});
			});
		};
		EmbeddedSession.prototype._onMessage=function (event) {
			var _this=this;
			if (!this.m_enabled) {
				return;
			}
			if (this.m_chosenWindow
				&& (this.m_chosenWindow !==event.source || this.m_chosenOrigin !==event.origin)) {
				return;
			}
			var eventData=event.data;
			if (eventData && eventData[CommunicationConstants.CommandKey]===CommunicationConstants.ApiReadyCommand) {
				if (!this.m_chosenWindow
					&& this._isValidDescendant(event.source)
					&& eventData[CommunicationConstants.SessionInfoKey]===this.m_options.sessionKey) {
					this.m_chosenWindow=event.source;
					this.m_chosenOrigin=event.origin;
					this._sendMessageWithCallback(this.m_id++, CommunicationConstants.GetAppContextCommand, null, function (appContext) {
						_this._setupContext(appContext);
						window.clearTimeout(_this.m_timeoutId);
						_this.m_promiseResolver();
					});
				}
				return;
			}
			if (eventData && eventData[CommunicationConstants.CommandKey]===CommunicationConstants.FireEventCommand) {
				var msg=eventData[CommunicationConstants.ParamsKey];
				var eventId=msg["EventId"];
				var targetId=msg["TargetId"];
				var data=msg["Data"];
				if (this.m_sessionEventManager) {
					var handlers=this.m_sessionEventManager.getHandlers(eventId, targetId);
					for (var i=0; i < handlers.length; i++) {
						handlers[i](data);
					}
				}
				return;
			}
			if (eventData && eventData.hasOwnProperty(CommunicationConstants.RespondingId)) {
				var rId=eventData[CommunicationConstants.RespondingId];
				var callback=this.m_callbackList[rId];
				if (typeof callback==="function") {
					callback(eventData[CommunicationConstants.ParamsKey]);
				}
				delete this.m_callbackList[rId];
			}
		};
		EmbeddedSession.prototype._sendMessageWithCallback=function (id, command, data, callback) {
			this.m_callbackList[id]=callback;
			var message={};
			message[CommunicationConstants.SendingId]=id;
			message[CommunicationConstants.CommandKey]=command;
			message[CommunicationConstants.ParamsKey]=data;
			this.m_chosenWindow.postMessage(JSON.stringify(message), this.m_chosenOrigin);
		};
		EmbeddedSession.prototype._isValidDescendant=function (wnd) {
			var container=this.m_options.container || document.body;
			function doesFrameWindow(containerWindow) {
				if (containerWindow===wnd) {
					return true;
				}
				for (var i=0, len=containerWindow.frames.length; i < len; i++) {
					if (doesFrameWindow(containerWindow.frames[i])) {
						return true;
					}
				}
				return false;
			}
			var iframes=container.getElementsByTagName("iframe");
			for (var i=0, len=iframes.length; i < len; i++) {
				if (doesFrameWindow(iframes[i].contentWindow)) {
					return true;
				}
			}
			return false;
		};
		EmbeddedSession.prototype._setupContext=function (appContext) {
			if (!(this.m_appContext=appContext)) {
				return;
			}
		};
		return EmbeddedSession;
	}(OfficeExtension.SessionBase));
	OfficeExtension.EmbeddedSession=EmbeddedSession;
	var EmbeddedRequestExecutor=(function () {
		function EmbeddedRequestExecutor(session) {
			this.m_session=session;
		}
		EmbeddedRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var _this=this;
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, EmbeddedRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				_this.m_session._invoke(CommunicationConstants.ExecuteMethodCommand, function (status, result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (status==EmbeddedApiStatus.Success) {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBodyFromSafeArray(result.Data), OfficeExtension.RichApiMessageUtility.getResponseHeadersFromSafeArray(result.Data));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.Code, result.error.Message);
					}
					resolve(response);
				}, EmbeddedRequestExecutor._transformMessageArrayIntoParams(messageSafearray));
			});
		};
		EmbeddedRequestExecutor._transformMessageArrayIntoParams=function (msgArray) {
			return {
				ArrayData: msgArray,
				DdaMethod: {
					DispatchId: EmbeddedRequestExecutor.DispidExecuteRichApiRequestMethod
				}
			};
		};
		EmbeddedRequestExecutor.DispidExecuteRichApiRequestMethod=93;
		EmbeddedRequestExecutor.SourceLibHeaderValue="Embedded";
		return EmbeddedRequestExecutor;
	}());
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var RuntimeError=(function (_super) {
			__extends(RuntimeError, _super);
			function RuntimeError(error) {
				_super.call(this, (typeof error==="string") ? error : error.message);
				this.name="OfficeExtension.Error";
				if (typeof error==="string") {
					this.message=error;
				}
				else {
					this.code=error.code;
					this.message=error.message;
					this.traceMessages=error.traceMessages || [];
					this.innerError=error.innerError || null;
					this.debugInfo=this._createDebugInfo(error.debugInfo || {});
				}
			}
			RuntimeError.prototype.toString=function () {
				return this.code+': '+this.message;
			};
			RuntimeError.prototype._createDebugInfo=function (partialDebugInfo) {
				var debugInfo={
					code: this.code,
					message: this.message,
					toString: function () {
						return JSON.stringify(this);
					}
				};
				for (var key in partialDebugInfo) {
					debugInfo[key]=partialDebugInfo[key];
				}
				if (this.innerError) {
					if (this.innerError instanceof OfficeExtension.Error) {
						debugInfo.innerError=this.innerError.debugInfo;
					}
					else {
						debugInfo.innerError=this.innerError;
					}
				}
				return debugInfo;
			};
			RuntimeError._createInvalidArgError=function (error) {
				return new _Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidArgument,
					message: (OfficeExtension.Utility.isNullOrEmptyString(error.argumentName) ?
						OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgumentGeneric) :
						OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidArgument, error.argumentName)),
					debugInfo: error.errorLocation ? { errorLocation: error.errorLocation } : {},
					innerError: error.innerError
				});
			};
			return RuntimeError;
		}(Error));
		_Internal.RuntimeError=RuntimeError;
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	OfficeExtension.Error=_Internal.RuntimeError;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ErrorCodes=(function () {
		function ErrorCodes() {
		}
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.activityLimitReached="ActivityLimitReached";
		ErrorCodes.invalidObjectPath="InvalidObjectPath";
		ErrorCodes.propertyNotLoaded="PropertyNotLoaded";
		ErrorCodes.valueNotLoaded="ValueNotLoaded";
		ErrorCodes.invalidRequestContext="InvalidRequestContext";
		ErrorCodes.invalidArgument="InvalidArgument";
		ErrorCodes.runMustReturnPromise="RunMustReturnPromise";
		ErrorCodes.cannotRegisterEvent="CannotRegisterEvent";
		ErrorCodes.apiNotFound="ApiNotFound";
		ErrorCodes.connectionFailure="ConnectionFailure";
		ErrorCodes.timeout="Timeout";
		ErrorCodes.invalidOrTimedOutSession="InvalidOrTimedOutSession";
		return ErrorCodes;
	}());
	OfficeExtension.ErrorCodes=ErrorCodes;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var EventHandlers=(function () {
		function EventHandlers(context, parentObject, name, eventInfo) {
			var _this=this;
			this.m_id=context._nextId();
			this.m_context=context;
			this.m_name=name;
			this.m_handlers=[];
			this.m_registered=false;
			this.m_eventInfo=eventInfo;
			this.m_callback=function (args) {
				_this.m_eventInfo.eventArgsTransformFunc(args)
					.then(function (newArgs) { return _this.fireEvent(newArgs); });
			};
		}
		Object.defineProperty(EventHandlers.prototype, "_registered", {
			get: function () {
				return this.m_registered;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_id", {
			get: function () {
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(EventHandlers.prototype, "_handlers", {
			get: function () {
				return this.m_handlers;
			},
			enumerable: true,
			configurable: true
		});
		EventHandlers.prototype.add=function (handler) {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: handler, operation: 0 });
			return new OfficeExtension.EventHandlerResult(this.m_context, this, handler);
		};
		EventHandlers.prototype.remove=function (handler) {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: handler, operation: 1 });
		};
		EventHandlers.prototype.removeAll=function () {
			var action=OfficeExtension.ActionFactory.createTraceAction(this.m_context, null, false);
			this.m_context._pendingRequest._addPendingEventHandlerAction(this, { id: action.actionInfo.Id, handler: null, operation: 2 });
		};
		EventHandlers.prototype._processRegistration=function (req) {
			var _this=this;
			var ret=OfficeExtension.Utility._createPromiseFromResult(null);
			var actions=req._getPendingEventHandlerActions(this);
			if (!actions) {
				return ret;
			}
			var handlersResult=[];
			for (var i=0; i < this.m_handlers.length; i++) {
				handlersResult.push(this.m_handlers[i]);
			}
			var hasChange=false;
			for (var i=0; i < actions.length; i++) {
				if (req._responseTraceIds[actions[i].id]) {
					hasChange=true;
					switch (actions[i].operation) {
						case 0:
							handlersResult.push(actions[i].handler);
							break;
						case 1:
							for (var index=handlersResult.length - 1; index >=0; index--) {
								if (handlersResult[index]===actions[i].handler) {
									handlersResult.splice(index, 1);
									break;
								}
							}
							break;
						case 2:
							handlersResult=[];
							break;
					}
				}
			}
			if (hasChange) {
				if (!this.m_registered && handlersResult.length > 0) {
					ret=ret
						.then(function () { return _this.m_eventInfo.registerFunc(_this.m_callback); })
						.then(function () { return (_this.m_registered=true); });
				}
				else if (this.m_registered && handlersResult.length==0) {
					ret=ret
						.then(function () { return _this.m_eventInfo.unregisterFunc(_this.m_callback); })
						.catch(function (ex) {
						OfficeExtension.Utility.log("Error when unregister event: "+JSON.stringify(ex));
					})
						.then(function () { return (_this.m_registered=false); });
				}
				ret=ret
					.then(function () { return (_this.m_handlers=handlersResult); });
			}
			return ret;
		};
		EventHandlers.prototype.fireEvent=function (args) {
			var promises=[];
			for (var i=0; i < this.m_handlers.length; i++) {
				var handler=this.m_handlers[i];
				var p=OfficeExtension.Utility._createPromiseFromResult(null)
					.then(this.createFireOneEventHandlerFunc(handler, args))
					.catch(function (ex) {
					OfficeExtension.Utility.log("Error when invoke handler: "+JSON.stringify(ex));
				});
				promises.push(p);
			}
			OfficeExtension._Internal.OfficePromise.all(promises);
		};
		EventHandlers.prototype.createFireOneEventHandlerFunc=function (handler, args) {
			return function () { return handler(args); };
		};
		return EventHandlers;
	}());
	OfficeExtension.EventHandlers=EventHandlers;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var EventHandlerResult=(function () {
		function EventHandlerResult(context, handlers, handler) {
			this.m_context=context;
			this.m_allHandlers=handlers;
			this.m_handler=handler;
		}
		EventHandlerResult.prototype.remove=function () {
			if (this.m_allHandlers && this.m_handler) {
				this.m_allHandlers.remove(this.m_handler);
				this.m_allHandlers=null;
				this.m_handler=null;
			}
		};
		return EventHandlerResult;
	}());
	OfficeExtension.EventHandlerResult=EventHandlerResult;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var OfficeJsEventRegistration=(function () {
			function OfficeJsEventRegistration() {
			}
			OfficeJsEventRegistration.prototype.register=function (eventId, targetId, handler) {
				switch (eventId) {
					case 4:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.addHandlerAsync(Office.EventType.BindingDataChanged, handler, callback); });
						});
					case 3:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.addHandlerAsync(Office.EventType.BindingSelectionChanged, handler, callback); });
						});
					case 2:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, handler, callback); });
					case 1:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.settings.addHandlerAsync(Office.EventType.SettingsChanged, handler, callback); });
					case 13:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectDeleted, handler, { id: targetId }, callback); });
					case 14:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectSelectionChanged, handler, { id: targetId }, callback); });
					case 15:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ObjectDataChanged, handler, { id: targetId }, callback); });
					case 16:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.addHandlerAsync(Office.EventType.ContentControlAdded, handler, { id: targetId }, callback); });
					default:
						throw _Internal.RuntimeError._createInvalidArgError("eventId");
				}
			};
			OfficeJsEventRegistration.prototype.unregister=function (eventId, targetId, handler) {
				switch (eventId) {
					case 4:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.removeHandlerAsync(Office.EventType.BindingDataChanged, { handler: handler }, callback); });
						});
					case 3:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.bindings.getByIdAsync(targetId, callback); })
							.then(function (officeBinding) {
							return OfficeExtension.Utility.promisify(function (callback) { return officeBinding.removeHandlerAsync(Office.EventType.BindingSelectionChanged, { handler: handler }, callback); });
						});
					case 2:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, { handler: handler }, callback); });
					case 1:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.settings.removeHandlerAsync(Office.EventType.SettingsChanged, { handler: handler }, callback); });
					case 13:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectDeleted, { id: targetId, handler: handler }, callback); });
					case 14:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectSelectionChanged, { id: targetId, handler: handler }, callback); });
					case 15:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ObjectDataChanged, { id: targetId, handler: handler }, callback); });
					case 16:
						return OfficeExtension.Utility.promisify(function (callback) { return Office.context.document.removeHandlerAsync(Office.EventType.ContentControlAdded, { id: targetId, handler: handler }, callback); });
					default:
						throw _Internal.RuntimeError._createInvalidArgError("eventId");
				}
			};
			return OfficeJsEventRegistration;
		}());
		_Internal.officeJsEventRegistration=new OfficeJsEventRegistration();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var EventRegistration=(function () {
		function EventRegistration(registerEventImpl, unregisterEventImpl) {
			this.m_handlersByEventByTarget={};
			this.m_registerEventImpl=registerEventImpl;
			this.m_unregisterEventImpl=unregisterEventImpl;
		}
		EventRegistration.prototype.getHandlers=function (eventId, targetId) {
			if (OfficeExtension.Utility.isNullOrUndefined(targetId)) {
				targetId="";
			}
			var handlersById=this.m_handlersByEventByTarget[eventId];
			if (!handlersById) {
				handlersById={};
				this.m_handlersByEventByTarget[eventId]=handlersById;
			}
			var handlers=handlersById[targetId];
			if (!handlers) {
				handlers=[];
				handlersById[targetId]=handlers;
			}
			return handlers;
		};
		EventRegistration.prototype.register=function (eventId, targetId, handler) {
			if (!handler) {
				throw _Internal.RuntimeError._createInvalidArgError("handler");
			}
			var handlers=this.getHandlers(eventId, targetId);
			handlers.push(handler);
			if (handlers.length===1) {
				return this.m_registerEventImpl(eventId, targetId);
			}
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		EventRegistration.prototype.unregister=function (eventId, targetId, handler) {
			if (!handler) {
				throw _Internal.RuntimeError._createInvalidArgError("handler");
			}
			var handlers=this.getHandlers(eventId, targetId);
			for (var index=handlers.length - 1; index >=0; index--) {
				if (handlers[index]===handler) {
					handlers.splice(index, 1);
					break;
				}
			}
			if (handlers.length===0) {
				return this.m_unregisterEventImpl(eventId, targetId);
			}
			return OfficeExtension.Utility._createPromiseFromResult(null);
		};
		return EventRegistration;
	}());
	OfficeExtension.EventRegistration=EventRegistration;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var HttpRequestExecutor=(function () {
		function HttpRequestExecutor() {
		}
		HttpRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var requestMessageText=JSON.stringify(requestMessage.Body);
			var url=requestMessage.Url;
			if (url.charAt(url.length - 1) !="/") {
				url=url+"/";
			}
			url=url+OfficeExtension.Constants.processQuery;
			url=url+"?"+OfficeExtension.Constants.flags+"="+requestFlags.toString();
			var requestInfo={
				method: "POST",
				url: url,
				headers: {},
				body: requestMessageText
			};
			requestInfo.headers[OfficeExtension.Constants.sourceLibHeader]=HttpRequestExecutor.SourceLibHeaderValue;
			requestInfo.headers["CONTENT-TYPE"]="application/json";
			if (requestMessage.Headers) {
				for (var key in requestMessage.Headers) {
					requestInfo.headers[key]=requestMessage.Headers[key];
				}
			}
			return OfficeExtension.HttpUtility.sendRequest(requestInfo)
				.then(function (responseInfo) {
				var response;
				if (responseInfo.statusCode===200) {
					response={ ErrorCode: null, ErrorMessage: null, Headers: responseInfo.headers, Body: JSON.parse(responseInfo.body) };
				}
				else {
					OfficeExtension.Utility.log("Error Response:"+responseInfo.body);
					var error=OfficeExtension.Utility._parseErrorResponse(responseInfo);
					response={
						ErrorCode: error.errorCode,
						ErrorMessage: error.errorMessage,
						Headers: responseInfo.headers,
						Body: null
					};
				}
				return response;
			});
		};
		HttpRequestExecutor.SourceLibHeaderValue="officejs-rest";
		return HttpRequestExecutor;
	}());
	OfficeExtension.HttpRequestExecutor=HttpRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		_Internal.OfficeRequire=function () {
			if (typeof (require) !=="undefined") {
				return require;
			}
			return null;
		}();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var HttpUtility=(function () {
		function HttpUtility() {
		}
		HttpUtility.setCustomSendRequestFunc=function (func) {
			HttpUtility.s_customSendRequestFunc=func;
		};
		HttpUtility.xhrSendRequestFunc=function (request) {
			return new _Internal.OfficePromise(function (resolve, reject) {
				var xhr=new XMLHttpRequest();
				xhr.open(request.method, request.url);
				xhr.onload=function () {
					var resp={
						statusCode: xhr.status,
						headers: OfficeExtension.Utility._parseHttpResponseHeaders(xhr.getAllResponseHeaders()),
						body: xhr.responseText
					};
					resolve(resp);
				};
				xhr.onerror=function () {
					reject(new _Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.connectionFailure,
						message: OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithStatus, xhr.statusText)
					}));
				};
				if (request.headers) {
					for (var key in request.headers) {
						xhr.setRequestHeader(key, request.headers[key]);
					}
				}
				xhr.send(request.body);
			});
		};
		HttpUtility.nodejsRequestModuleSendRequestFunc=function (requestInfo) {
			HttpUtility.logRequest(requestInfo);
			var fetch=_Internal.OfficeRequire(HttpUtility.NodeJsRequestModuleName);
			return fetch(requestInfo.url, { method: requestInfo.method, headers: requestInfo.headers, body: requestInfo.body })
				.then(function (resp) {
				return resp.text()
					.then(function (body) {
					var statusCode=resp.status;
					var headers={};
					resp.headers.forEach(function (value, name) {
						headers[name]=value;
					});
					var ret={ statusCode: statusCode, headers: headers, body: body };
					HttpUtility.logResponse(ret);
					return ret;
				});
			});
		};
		HttpUtility.sendRequest=function (request) {
			HttpUtility.validateAndNormalizeRequest(request);
			var func=HttpUtility.s_customSendRequestFunc;
			if (!func) {
				if (typeof (window)==="undefined" || typeof (XMLHttpRequest)==="undefined") {
					func=HttpUtility.nodejsRequestModuleSendRequestFunc;
				}
				else {
					func=HttpUtility.xhrSendRequestFunc;
				}
			}
			return func(request);
		};
		HttpUtility.setCustomSendLocalDocumentRequestFunc=function (func) {
			HttpUtility.s_customSendLocalDocumentRequestFunc=func;
		};
		HttpUtility.sendLocalDocumentRequest=function (request) {
			HttpUtility.validateAndNormalizeRequest(request);
			var func;
			func=HttpUtility.s_customSendLocalDocumentRequestFunc || HttpUtility.officeJsSendLocalDocumentRequestFunc;
			return func(request);
		};
		HttpUtility.officeJsSendLocalDocumentRequestFunc=function (request) {
			request=OfficeExtension.Utility._validateLocalDocumentRequest(request);
			var requestSafeArray=OfficeExtension.Utility._buildRequestMessageSafeArray(request);
			return new _Internal.OfficePromise(function (resolve, reject) {
				OSF.DDA.RichApi.executeRichApiRequestAsync(requestSafeArray, function (asyncResult) {
					var response;
					if (asyncResult.status=="succeeded") {
						response=							{
								statusCode: OfficeExtension.RichApiMessageUtility.getResponseStatusCode(asyncResult),
								headers: OfficeExtension.RichApiMessageUtility.getResponseHeaders(asyncResult),
								body: OfficeExtension.RichApiMessageUtility.getResponseBody(asyncResult)
							};
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildHttpResponseFromOfficeJsError(asyncResult.error.code, asyncResult.error.message);
					}
					OfficeExtension.Utility.log(JSON.stringify(response));
					resolve(response);
				});
			});
		};
		HttpUtility.validateAndNormalizeRequest=function (request) {
			if (OfficeExtension.Utility.isNullOrUndefined(request)) {
				throw _Internal.RuntimeError._createInvalidArgError({
					argumentName: "request"
				});
			}
			if (OfficeExtension.Utility.isNullOrEmptyString(request.method)) {
				request.method="GET";
			}
			request.method=request.method.toUpperCase();
		};
		HttpUtility.logRequest=function (request) {
			if (OfficeExtension.Utility._logEnabled) {
				OfficeExtension.Utility.log("---HTTP Request---");
				OfficeExtension.Utility.log(request.method+" "+request.url);
				if (request.headers) {
					for (var key in request.headers) {
						OfficeExtension.Utility.log(key+": "+request.headers[key]);
					}
				}
				if (HttpUtility._logBody) {
					OfficeExtension.Utility.log(request.body);
				}
			}
		};
		HttpUtility.logResponse=function (response) {
			if (OfficeExtension.Utility._logEnabled) {
				OfficeExtension.Utility.log("---HTTP Response---");
				OfficeExtension.Utility.log(""+response.statusCode);
				if (response.headers) {
					for (var key in response.headers) {
						OfficeExtension.Utility.log(key+": "+response.headers[key]);
					}
				}
				if (HttpUtility._logBody) {
					OfficeExtension.Utility.log(response.body);
				}
			}
		};
		HttpUtility.NodeJsRequestModuleName="node-fetch";
		HttpUtility._logBody=false;
		return HttpUtility;
	}());
	OfficeExtension.HttpUtility=HttpUtility;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var InstantiateActionResultHandler=(function () {
		function InstantiateActionResultHandler(clientObject) {
			this.m_clientObject=clientObject;
		}
		InstantiateActionResultHandler.prototype._handleResult=function (value) {
			this.m_clientObject._handleIdResult(value);
		};
		return InstantiateActionResultHandler;
	}());
	OfficeExtension.InstantiateActionResultHandler=InstantiateActionResultHandler;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPath=(function () {
		function ObjectPath(objectPathInfo, parentObjectPath, isCollection, isInvalidAfterRequest) {
			this.m_objectPathInfo=objectPathInfo;
			this.m_parentObjectPath=parentObjectPath;
			this.m_isWriteOperation=false;
			this.m_isCollection=isCollection;
			this.m_isInvalidAfterRequest=isInvalidAfterRequest;
			this.m_isValid=true;
		}
		Object.defineProperty(ObjectPath.prototype, "objectPathInfo", {
			get: function () {
				return this.m_objectPathInfo;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isWriteOperation", {
			get: function () {
				return this.m_isWriteOperation;
			},
			set: function (value) {
				this.m_isWriteOperation=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isCollection", {
			get: function () {
				return this.m_isCollection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isInvalidAfterRequest", {
			get: function () {
				return this.m_isInvalidAfterRequest;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "parentObjectPath", {
			get: function () {
				return this.m_parentObjectPath;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "argumentObjectPaths", {
			get: function () {
				return this.m_argumentObjectPaths;
			},
			set: function (value) {
				this.m_argumentObjectPaths=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "isValid", {
			get: function () {
				return this.m_isValid;
			},
			set: function (value) {
				this.m_isValid=value;
				if (!value &&
					this.m_objectPathInfo.ObjectPathType===6 &&
					this.m_savedObjectPathInfo) {
					ObjectPath.copyObjectPathInfo(this.m_savedObjectPathInfo.pathInfo, this.m_objectPathInfo);
					this.m_parentObjectPath=this.m_savedObjectPathInfo.parent;
					this.m_isValid=true;
					this.m_savedObjectPathInfo=null;
				}
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ObjectPath.prototype, "getByIdMethodName", {
			get: function () {
				return this.m_getByIdMethodName;
			},
			set: function (value) {
				this.m_getByIdMethodName=value;
			},
			enumerable: true,
			configurable: true
		});
		ObjectPath.prototype._updateAsNullObject=function () {
			this.m_isInvalidAfterRequest=false;
			this.m_isValid=true;
			this.m_objectPathInfo.ObjectPathType=7;
			this.m_objectPathInfo.Name="";
			this.m_objectPathInfo.ArgumentInfo={};
			this.m_parentObjectPath=null;
			this.m_argumentObjectPaths=null;
		};
		ObjectPath.prototype.updateUsingObjectData=function (value) {
			var referenceId=value[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				if (!this.m_savedObjectPathInfo &&
					!this.isInvalidAfterRequest &&
					ObjectPath.isRestorableObjectPath(this.m_objectPathInfo.ObjectPathType)) {
					var pathInfo={};
					ObjectPath.copyObjectPathInfo(this.m_objectPathInfo, pathInfo);
					this.m_savedObjectPathInfo={
						pathInfo: pathInfo,
						parent: this.m_parentObjectPath
					};
				}
				this.m_isInvalidAfterRequest=false;
				this.m_isValid=true;
				this.m_objectPathInfo.ObjectPathType=6;
				this.m_objectPathInfo.Name=referenceId;
				this.m_objectPathInfo.ArgumentInfo={};
				this.m_parentObjectPath=null;
				this.m_argumentObjectPaths=null;
				return;
			}
			var parentIsCollection=this.parentObjectPath && this.parentObjectPath.isCollection;
			var getByIdMethodName=this.getByIdMethodName;
			if (parentIsCollection || !OfficeExtension.Utility.isNullOrEmptyString(getByIdMethodName)) {
				var id=value[OfficeExtension.Constants.id];
				if (OfficeExtension.Utility.isNullOrUndefined(id)) {
					id=value[OfficeExtension.Constants.idPrivate];
				}
				if (!OfficeExtension.Utility.isNullOrUndefined(id)) {
					this.m_isInvalidAfterRequest=false;
					this.m_isValid=true;
					if (parentIsCollection) {
						this.m_objectPathInfo.ObjectPathType=5;
						this.m_objectPathInfo.Name="";
					}
					else {
						this.m_objectPathInfo.ObjectPathType=3;
						this.m_objectPathInfo.Name=getByIdMethodName;
						this.m_getByIdMethodName=null;
					}
					this.isWriteOperation=false;
					this.m_objectPathInfo.ArgumentInfo={};
					this.m_objectPathInfo.ArgumentInfo.Arguments=[id];
					this.m_argumentObjectPaths=null;
					return;
				}
			}
		};
		ObjectPath.isRestorableObjectPath=function (objectPathType) {
			return (objectPathType===1 ||
				objectPathType===5 ||
				objectPathType===3 ||
				objectPathType===4);
		};
		ObjectPath.copyObjectPathInfo=function (src, dest) {
			dest.Id=src.Id;
			dest.ArgumentInfo=src.ArgumentInfo;
			dest.Name=src.Name;
			dest.ObjectPathType=src.ObjectPathType;
			dest.ParentObjectPathId=src.ParentObjectPathId;
		};
		return ObjectPath;
	}());
	OfficeExtension.ObjectPath=ObjectPath;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ObjectPathFactory=(function () {
		function ObjectPathFactory() {
		}
		ObjectPathFactory.createGlobalObjectObjectPath=function (context) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 1, Name: "" };
			return new OfficeExtension.ObjectPath(objectPathInfo, null, false, false);
		};
		ObjectPathFactory.createNewObjectObjectPath=function (context, typeName, isCollection) {
			var objectPathInfo={ Id: context._nextId(), ObjectPathType: 2, Name: typeName };
			return new OfficeExtension.ObjectPath(objectPathInfo, null, isCollection, false);
		};
		ObjectPathFactory.createPropertyObjectPath=function (context, parent, propertyName, isCollection, isInvalidAfterRequest) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 4,
				Name: propertyName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
			};
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
		};
		ObjectPathFactory.createIndexerObjectPath=function (context, parent, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5,
				Name: "",
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createIndexerObjectPathUsingParentPath=function (context, parentObjectPath, args) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 5,
				Name: "",
				ParentObjectPathId: parentObjectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=args;
			return new OfficeExtension.ObjectPath(objectPathInfo, parentObjectPath, false, false);
		};
		ObjectPathFactory.createMethodObjectPath=function (context, parent, methodName, operationType, args, isCollection, isInvalidAfterRequest, getByIdMethodName) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3,
				Name: methodName,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			var argumentObjectPaths=OfficeExtension.Utility.setMethodArguments(context, objectPathInfo.ArgumentInfo, args);
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, isCollection, isInvalidAfterRequest);
			ret.argumentObjectPaths=argumentObjectPaths;
			ret.isWriteOperation=(operationType !=1);
			ret.getByIdMethodName=getByIdMethodName;
			return ret;
		};
		ObjectPathFactory.createReferenceIdObjectPath=function (context, referenceId) {
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 6,
				Name: referenceId,
				ArgumentInfo: {}
			};
			var ret=new OfficeExtension.ObjectPath(objectPathInfo, null, false, false);
			return ret;
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt=function (hasIndexerMethod, context, parent, childItem, index) {
			var id=childItem[OfficeExtension.Constants.id];
			if (OfficeExtension.Utility.isNullOrUndefined(id)) {
				id=childItem[OfficeExtension.Constants.idPrivate];
			}
			if (hasIndexerMethod && !OfficeExtension.Utility.isNullOrUndefined(id)) {
				return ObjectPathFactory.createChildItemObjectPathUsingIndexer(context, parent, childItem);
			}
			else {
				return ObjectPathFactory.createChildItemObjectPathUsingGetItemAt(context, parent, childItem, index);
			}
		};
		ObjectPathFactory.createChildItemObjectPathUsingIndexer=function (context, parent, childItem) {
			var id=childItem[OfficeExtension.Constants.id];
			if (OfficeExtension.Utility.isNullOrUndefined(id)) {
				id=childItem[OfficeExtension.Constants.idPrivate];
			}
			var objectPathInfo=objectPathInfo=				{
					Id: context._nextId(),
					ObjectPathType: 5,
					Name: "",
					ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
					ArgumentInfo: {}
				};
			objectPathInfo.ArgumentInfo.Arguments=[id];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		ObjectPathFactory.createChildItemObjectPathUsingGetItemAt=function (context, parent, childItem, index) {
			var indexFromServer=childItem[OfficeExtension.Constants.index];
			if (indexFromServer) {
				index=indexFromServer;
			}
			var objectPathInfo={
				Id: context._nextId(),
				ObjectPathType: 3,
				Name: OfficeExtension.Constants.getItemAt,
				ParentObjectPathId: parent._objectPath.objectPathInfo.Id,
				ArgumentInfo: {}
			};
			objectPathInfo.ArgumentInfo.Arguments=[index];
			return new OfficeExtension.ObjectPath(objectPathInfo, parent._objectPath, false, false);
		};
		return ObjectPathFactory;
	}());
	OfficeExtension.ObjectPathFactory=ObjectPathFactory;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var OfficeJsRequestExecutor=(function () {
		function OfficeJsRequestExecutor() {
		}
		OfficeJsRequestExecutor.prototype.executeAsync=function (customData, requestFlags, requestMessage) {
			var messageSafearray=OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(customData, requestFlags, requestMessage, OfficeJsRequestExecutor.SourceLibHeaderValue);
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				OSF.DDA.RichApi.executeRichApiRequestAsync(messageSafearray, function (result) {
					OfficeExtension.Utility.log("Response:");
					OfficeExtension.Utility.log(JSON.stringify(result));
					var response;
					if (result.status=="succeeded") {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(OfficeExtension.RichApiMessageUtility.getResponseBody(result), OfficeExtension.RichApiMessageUtility.getResponseHeaders(result));
					}
					else {
						response=OfficeExtension.RichApiMessageUtility.buildResponseOnError(result.error.code, result.error.message);
					}
					resolve(response);
				});
			});
		};
		OfficeJsRequestExecutor.SourceLibHeaderValue="officejs";
		return OfficeJsRequestExecutor;
	}());
	OfficeExtension.OfficeJsRequestExecutor=OfficeJsRequestExecutor;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var _Internal;
	(function (_Internal) {
		var PromiseImpl;
		(function (PromiseImpl) {
			function Init() {
				return (function () {
					"use strict";
					function lib$es6$promise$utils$$objectOrFunction(x) {
						return typeof x==='function' || (typeof x==='object' && x !==null);
					}
					function lib$es6$promise$utils$$isFunction(x) {
						return typeof x==='function';
					}
					function lib$es6$promise$utils$$isMaybeThenable(x) {
						return typeof x==='object' && x !==null;
					}
					var lib$es6$promise$utils$$_isArray;
					if (!Array.isArray) {
						lib$es6$promise$utils$$_isArray=function (x) {
							return Object.prototype.toString.call(x)==='[object Array]';
						};
					}
					else {
						lib$es6$promise$utils$$_isArray=Array.isArray;
					}
					var lib$es6$promise$utils$$isArray=lib$es6$promise$utils$$_isArray;
					var lib$es6$promise$asap$$len=0;
					var lib$es6$promise$asap$$toString={}.toString;
					var lib$es6$promise$asap$$vertxNext;
					var lib$es6$promise$asap$$customSchedulerFn;
					var lib$es6$promise$asap$$asap=function asap(callback, arg) {
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len]=callback;
						lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len+1]=arg;
						lib$es6$promise$asap$$len+=2;
						if (lib$es6$promise$asap$$len===2) {
							if (lib$es6$promise$asap$$customSchedulerFn) {
								lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
							}
							else {
								lib$es6$promise$asap$$scheduleFlush();
							}
						}
					};
					function lib$es6$promise$asap$$setScheduler(scheduleFn) {
						lib$es6$promise$asap$$customSchedulerFn=scheduleFn;
					}
					function lib$es6$promise$asap$$setAsap(asapFn) {
						lib$es6$promise$asap$$asap=asapFn;
					}
					var lib$es6$promise$asap$$browserWindow=(typeof window !=='undefined') ? window : undefined;
					var lib$es6$promise$asap$$browserGlobal=lib$es6$promise$asap$$browserWindow || {};
					var lib$es6$promise$asap$$BrowserMutationObserver=lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
					var lib$es6$promise$asap$$isNode=typeof process !=='undefined' && {}.toString.call(process)==='[object process]';
					var lib$es6$promise$asap$$isWorker=typeof Uint8ClampedArray !=='undefined' &&
						typeof importScripts !=='undefined' &&
						typeof MessageChannel !=='undefined';
					function lib$es6$promise$asap$$useNextTick() {
						var nextTick=process.nextTick;
						var version=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
						if (Array.isArray(version) && version[1]==='0' && version[2]==='10') {
							nextTick=setImmediate;
						}
						return function () {
							nextTick(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useVertxTimer() {
						return function () {
							lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
						};
					}
					function lib$es6$promise$asap$$useMutationObserver() {
						var iterations=0;
						var observer=new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
						var node=document.createTextNode('');
						observer.observe(node, { characterData: true });
						return function () {
							node.data=(iterations=++iterations % 2);
						};
					}
					function lib$es6$promise$asap$$useMessageChannel() {
						var channel=new MessageChannel();
						channel.port1.onmessage=lib$es6$promise$asap$$flush;
						return function () {
							channel.port2.postMessage(0);
						};
					}
					function lib$es6$promise$asap$$useSetTimeout() {
						return function () {
							setTimeout(lib$es6$promise$asap$$flush, 1);
						};
					}
					var lib$es6$promise$asap$$queue=new Array(1000);
					function lib$es6$promise$asap$$flush() {
						for (var i=0; i < lib$es6$promise$asap$$len; i+=2) {
							var callback=lib$es6$promise$asap$$queue[i];
							var arg=lib$es6$promise$asap$$queue[i+1];
							callback(arg);
							lib$es6$promise$asap$$queue[i]=undefined;
							lib$es6$promise$asap$$queue[i+1]=undefined;
						}
						lib$es6$promise$asap$$len=0;
					}
					function lib$es6$promise$asap$$attemptVertex() {
						try {
							var r=require;
							var vertx=r('vertx');
							lib$es6$promise$asap$$vertxNext=vertx.runOnLoop || vertx.runOnContext;
							return lib$es6$promise$asap$$useVertxTimer();
						}
						catch (e) {
							return lib$es6$promise$asap$$useSetTimeout();
						}
					}
					var lib$es6$promise$asap$$scheduleFlush;
					if (lib$es6$promise$asap$$isNode) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useNextTick();
					}
					else if (lib$es6$promise$asap$$BrowserMutationObserver) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMutationObserver();
					}
					else if (lib$es6$promise$asap$$isWorker) {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMessageChannel();
					}
					else if (lib$es6$promise$asap$$browserWindow===undefined && typeof require==='function') {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$attemptVertex();
					}
					else {
						lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useSetTimeout();
					}
					function lib$es6$promise$$internal$$noop() { }
					var lib$es6$promise$$internal$$PENDING=void 0;
					var lib$es6$promise$$internal$$FULFILLED=1;
					var lib$es6$promise$$internal$$REJECTED=2;
					var lib$es6$promise$$internal$$GET_THEN_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$selfFullfillment() {
						return new TypeError("You cannot resolve a promise with itself");
					}
					function lib$es6$promise$$internal$$cannotReturnOwn() {
						return new TypeError('A promises callback cannot return that same promise.');
					}
					function lib$es6$promise$$internal$$getThen(promise) {
						try {
							return promise.then;
						}
						catch (error) {
							lib$es6$promise$$internal$$GET_THEN_ERROR.error=error;
							return lib$es6$promise$$internal$$GET_THEN_ERROR;
						}
					}
					function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
						try {
							then.call(value, fulfillmentHandler, rejectionHandler);
						}
						catch (e) {
							return e;
						}
					}
					function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
						lib$es6$promise$asap$$asap(function (promise) {
							var sealed=false;
							var error=lib$es6$promise$$internal$$tryThen(then, thenable, function (value) {
								if (sealed) {
									return;
								}
								sealed=true;
								if (thenable !==value) {
									lib$es6$promise$$internal$$resolve(promise, value);
								}
								else {
									lib$es6$promise$$internal$$fulfill(promise, value);
								}
							}, function (reason) {
								if (sealed) {
									return;
								}
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, reason);
							}, 'Settle: '+(promise._label || ' unknown promise'));
							if (!sealed && error) {
								sealed=true;
								lib$es6$promise$$internal$$reject(promise, error);
							}
						}, promise);
					}
					function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
						if (thenable._state===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, thenable._result);
						}
						else if (thenable._state===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, thenable._result);
						}
						else {
							lib$es6$promise$$internal$$subscribe(thenable, undefined, function (value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function (reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
					}
					function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
						if (maybeThenable.constructor===promise.constructor) {
							lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
						}
						else {
							var then=lib$es6$promise$$internal$$getThen(maybeThenable);
							if (then===lib$es6$promise$$internal$$GET_THEN_ERROR) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
							}
							else if (then===undefined) {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
							else if (lib$es6$promise$utils$$isFunction(then)) {
								lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
							}
							else {
								lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
							}
						}
					}
					function lib$es6$promise$$internal$$resolve(promise, value) {
						if (promise===value) {
							lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
						}
						else if (lib$es6$promise$utils$$objectOrFunction(value)) {
							lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
						}
						else {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
					}
					function lib$es6$promise$$internal$$publishRejection(promise) {
						if (promise._onerror) {
							promise._onerror(promise._result);
						}
						lib$es6$promise$$internal$$publish(promise);
					}
					function lib$es6$promise$$internal$$fulfill(promise, value) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._result=value;
						promise._state=lib$es6$promise$$internal$$FULFILLED;
						if (promise._subscribers.length !==0) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
						}
					}
					function lib$es6$promise$$internal$$reject(promise, reason) {
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
							return;
						}
						promise._state=lib$es6$promise$$internal$$REJECTED;
						promise._result=reason;
						lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
					}
					function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
						var subscribers=parent._subscribers;
						var length=subscribers.length;
						parent._onerror=null;
						subscribers[length]=child;
						subscribers[length+lib$es6$promise$$internal$$FULFILLED]=onFulfillment;
						subscribers[length+lib$es6$promise$$internal$$REJECTED]=onRejection;
						if (length===0 && parent._state) {
							lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
						}
					}
					function lib$es6$promise$$internal$$publish(promise) {
						var subscribers=promise._subscribers;
						var settled=promise._state;
						if (subscribers.length===0) {
							return;
						}
						var child, callback, detail=promise._result;
						for (var i=0; i < subscribers.length; i+=3) {
							child=subscribers[i];
							callback=subscribers[i+settled];
							if (child) {
								lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
							}
							else {
								callback(detail);
							}
						}
						promise._subscribers.length=0;
					}
					function lib$es6$promise$$internal$$ErrorObject() {
						this.error=null;
					}
					var lib$es6$promise$$internal$$TRY_CATCH_ERROR=new lib$es6$promise$$internal$$ErrorObject();
					function lib$es6$promise$$internal$$tryCatch(callback, detail) {
						try {
							return callback(detail);
						}
						catch (e) {
							lib$es6$promise$$internal$$TRY_CATCH_ERROR.error=e;
							return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
						}
					}
					function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
						var hasCallback=lib$es6$promise$utils$$isFunction(callback), value, error, succeeded, failed;
						if (hasCallback) {
							value=lib$es6$promise$$internal$$tryCatch(callback, detail);
							if (value===lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
								failed=true;
								error=value.error;
								value=null;
							}
							else {
								succeeded=true;
							}
							if (promise===value) {
								lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
								return;
							}
						}
						else {
							value=detail;
							succeeded=true;
						}
						if (promise._state !==lib$es6$promise$$internal$$PENDING) {
						}
						else if (hasCallback && succeeded) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						else if (failed) {
							lib$es6$promise$$internal$$reject(promise, error);
						}
						else if (settled===lib$es6$promise$$internal$$FULFILLED) {
							lib$es6$promise$$internal$$fulfill(promise, value);
						}
						else if (settled===lib$es6$promise$$internal$$REJECTED) {
							lib$es6$promise$$internal$$reject(promise, value);
						}
					}
					function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
						try {
							resolver(function resolvePromise(value) {
								lib$es6$promise$$internal$$resolve(promise, value);
							}, function rejectPromise(reason) {
								lib$es6$promise$$internal$$reject(promise, reason);
							});
						}
						catch (e) {
							lib$es6$promise$$internal$$reject(promise, e);
						}
					}
					function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
						var enumerator=this;
						enumerator._instanceConstructor=Constructor;
						enumerator.promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (enumerator._validateInput(input)) {
							enumerator._input=input;
							enumerator.length=input.length;
							enumerator._remaining=input.length;
							enumerator._init();
							if (enumerator.length===0) {
								lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
							}
							else {
								enumerator.length=enumerator.length || 0;
								enumerator._enumerate();
								if (enumerator._remaining===0) {
									lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
								}
							}
						}
						else {
							lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
						}
					}
					lib$es6$promise$enumerator$$Enumerator.prototype._validateInput=function (input) {
						return lib$es6$promise$utils$$isArray(input);
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._validationError=function () {
						return new _Internal.Error('Array Methods must be provided an Array');
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._init=function () {
						this._result=new Array(this.length);
					};
					var lib$es6$promise$enumerator$$default=lib$es6$promise$enumerator$$Enumerator;
					lib$es6$promise$enumerator$$Enumerator.prototype._enumerate=function () {
						var enumerator=this;
						var length=enumerator.length;
						var promise=enumerator.promise;
						var input=enumerator._input;
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							enumerator._eachEntry(input[i], i);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry=function (entry, i) {
						var enumerator=this;
						var c=enumerator._instanceConstructor;
						if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
							if (entry.constructor===c && entry._state !==lib$es6$promise$$internal$$PENDING) {
								entry._onerror=null;
								enumerator._settledAt(entry._state, i, entry._result);
							}
							else {
								enumerator._willSettleAt(c.resolve(entry), i);
							}
						}
						else {
							enumerator._remaining--;
							enumerator._result[i]=entry;
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._settledAt=function (state, i, value) {
						var enumerator=this;
						var promise=enumerator.promise;
						if (promise._state===lib$es6$promise$$internal$$PENDING) {
							enumerator._remaining--;
							if (state===lib$es6$promise$$internal$$REJECTED) {
								lib$es6$promise$$internal$$reject(promise, value);
							}
							else {
								enumerator._result[i]=value;
							}
						}
						if (enumerator._remaining===0) {
							lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
						}
					};
					lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt=function (promise, i) {
						var enumerator=this;
						lib$es6$promise$$internal$$subscribe(promise, undefined, function (value) {
							enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
						}, function (reason) {
							enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
						});
					};
					function lib$es6$promise$promise$all$$all(entries) {
						return new lib$es6$promise$enumerator$$default(this, entries).promise;
					}
					var lib$es6$promise$promise$all$$default=lib$es6$promise$promise$all$$all;
					function lib$es6$promise$promise$race$$race(entries) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						if (!lib$es6$promise$utils$$isArray(entries)) {
							lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
							return promise;
						}
						var length=entries.length;
						function onFulfillment(value) {
							lib$es6$promise$$internal$$resolve(promise, value);
						}
						function onRejection(reason) {
							lib$es6$promise$$internal$$reject(promise, reason);
						}
						for (var i=0; promise._state===lib$es6$promise$$internal$$PENDING && i < length; i++) {
							lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
						}
						return promise;
					}
					var lib$es6$promise$promise$race$$default=lib$es6$promise$promise$race$$race;
					function lib$es6$promise$promise$resolve$$resolve(object) {
						var Constructor=this;
						if (object && typeof object==='object' && object.constructor===Constructor) {
							return object;
						}
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$resolve(promise, object);
						return promise;
					}
					var lib$es6$promise$promise$resolve$$default=lib$es6$promise$promise$resolve$$resolve;
					function lib$es6$promise$promise$reject$$reject(reason) {
						var Constructor=this;
						var promise=new Constructor(lib$es6$promise$$internal$$noop);
						lib$es6$promise$$internal$$reject(promise, reason);
						return promise;
					}
					var lib$es6$promise$promise$reject$$default=lib$es6$promise$promise$reject$$reject;
					var lib$es6$promise$promise$$counter=0;
					function lib$es6$promise$promise$$needsResolver() {
						throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
					}
					function lib$es6$promise$promise$$needsNew() {
						throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
					}
					var lib$es6$promise$promise$$default=lib$es6$promise$promise$$Promise;
					function lib$es6$promise$promise$$Promise(resolver) {
						this._id=lib$es6$promise$promise$$counter++;
						this._state=undefined;
						this._result=undefined;
						this._subscribers=[];
						if (lib$es6$promise$$internal$$noop !==resolver) {
							if (!lib$es6$promise$utils$$isFunction(resolver)) {
								lib$es6$promise$promise$$needsResolver();
							}
							if (!(this instanceof lib$es6$promise$promise$$Promise)) {
								lib$es6$promise$promise$$needsNew();
							}
							lib$es6$promise$$internal$$initializePromise(this, resolver);
						}
					}
					lib$es6$promise$promise$$Promise.all=lib$es6$promise$promise$all$$default;
					lib$es6$promise$promise$$Promise.race=lib$es6$promise$promise$race$$default;
					lib$es6$promise$promise$$Promise.resolve=lib$es6$promise$promise$resolve$$default;
					lib$es6$promise$promise$$Promise.reject=lib$es6$promise$promise$reject$$default;
					lib$es6$promise$promise$$Promise._setScheduler=lib$es6$promise$asap$$setScheduler;
					lib$es6$promise$promise$$Promise._setAsap=lib$es6$promise$asap$$setAsap;
					lib$es6$promise$promise$$Promise._asap=lib$es6$promise$asap$$asap;
					lib$es6$promise$promise$$Promise.prototype={
						constructor: lib$es6$promise$promise$$Promise,
						then: function (onFulfillment, onRejection) {
							var parent=this;
							var state=parent._state;
							if (state===lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state===lib$es6$promise$$internal$$REJECTED && !onRejection) {
								return this;
							}
							var child=new this.constructor(lib$es6$promise$$internal$$noop);
							var result=parent._result;
							if (state) {
								var callback=arguments[state - 1];
								lib$es6$promise$asap$$asap(function () {
									lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
								});
							}
							else {
								lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
							}
							return child;
						},
						'catch': function (onRejection) {
							return this.then(null, onRejection);
						}
					};
					return lib$es6$promise$promise$$default;
				}).call(this);
			}
			PromiseImpl.Init=Init;
		})(PromiseImpl=_Internal.PromiseImpl || (_Internal.PromiseImpl={}));
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var _Internal;
	(function (_Internal) {
		function isEdgeLessThan14() {
			var userAgent=window.navigator.userAgent;
			var versionIdx=userAgent.indexOf("Edge/");
			if (versionIdx >=0) {
				userAgent=userAgent.substring(versionIdx+5, userAgent.length);
				if (userAgent < "14.14393")
					return true;
				else
					return false;
			}
			return false;
		}
		function determinePromise() {
			if (typeof (window)==="undefined" && typeof (Promise)==="function") {
				return Promise;
			}
			if (typeof (window) !=="undefined" && window.Promise) {
				if (isEdgeLessThan14()) {
					return _Internal.PromiseImpl.Init();
				}
				else {
					return window.Promise;
				}
			}
			else {
				return _Internal.PromiseImpl.Init();
			}
		}
		_Internal.OfficePromise=determinePromise();
	})(_Internal=OfficeExtension._Internal || (OfficeExtension._Internal={}));
	var OfficePromise=_Internal.OfficePromise;
	OfficeExtension.Promise=OfficePromise;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var TrackedObjects=(function () {
		function TrackedObjects(context) {
			this._autoCleanupList={};
			this.m_context=context;
		}
		TrackedObjects.prototype.add=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._addCommon(item, true); });
			}
			else {
				this._addCommon(param, true);
			}
		};
		TrackedObjects.prototype._autoAdd=function (object) {
			this._addCommon(object, false);
			this._autoCleanupList[object._objectPath.objectPathInfo.Id]=object;
		};
		TrackedObjects.prototype._autoTrackIfNecessaryWhenHandleObjectResultValue=function (object, resultValue) {
			var shouldAutoTrack=(this.m_context._autoCleanup &&
				!object[OfficeExtension.Constants.isTracked] &&
				object !==this.m_context._rootObject &&
				resultValue &&
				!OfficeExtension.Utility.isNullOrEmptyString(resultValue[OfficeExtension.Constants.referenceId]));
			if (shouldAutoTrack) {
				this._autoCleanupList[object._objectPath.objectPathInfo.Id]=object;
				object[OfficeExtension.Constants.isTracked]=true;
			}
		};
		TrackedObjects.prototype._addCommon=function (object, isExplicitlyAdded) {
			if (object[OfficeExtension.Constants.isTracked]) {
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				return;
			}
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (OfficeExtension.Utility.isNullOrEmptyString(referenceId) && object._KeepReference) {
				object._KeepReference();
				OfficeExtension.ActionFactory.createInstantiateAction(this.m_context, object);
				if (isExplicitlyAdded && this.m_context._autoCleanup) {
					delete this._autoCleanupList[object._objectPath.objectPathInfo.Id];
				}
				object[OfficeExtension.Constants.isTracked]=true;
			}
		};
		TrackedObjects.prototype.remove=function (param) {
			var _this=this;
			if (Array.isArray(param)) {
				param.forEach(function (item) { return _this._removeCommon(item); });
			}
			else {
				this._removeCommon(param);
			}
		};
		TrackedObjects.prototype._removeCommon=function (object) {
			var referenceId=object[OfficeExtension.Constants.referenceId];
			if (!OfficeExtension.Utility.isNullOrEmptyString(referenceId)) {
				var rootObject=this.m_context._rootObject;
				if (rootObject._RemoveReference) {
					rootObject._RemoveReference(referenceId);
				}
				delete object[OfficeExtension.Constants.isTracked];
			}
		};
		TrackedObjects.prototype._retrieveAndClearAutoCleanupList=function () {
			var list=this._autoCleanupList;
			this._autoCleanupList={};
			return list;
		};
		return TrackedObjects;
	}());
	OfficeExtension.TrackedObjects=TrackedObjects;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ResourceStrings=(function () {
		function ResourceStrings() {
		}
		ResourceStrings.cannotRegisterEvent="CannotRegisterEvent";
		ResourceStrings.connectionFailureWithStatus="ConnectionFailureWithStatus";
		ResourceStrings.connectionFailureWithDetails="ConnectionFailureWithDetails";
		ResourceStrings.invalidObjectPath="InvalidObjectPath";
		ResourceStrings.invalidRequestContext="InvalidRequestContext";
		ResourceStrings.invalidArgument="InvalidArgument";
		ResourceStrings.invalidArgumentGeneric="InvalidArgumentGeneric";
		ResourceStrings.propertyNotLoaded="PropertyNotLoaded";
		ResourceStrings.runMustReturnPromise="RunMustReturnPromise";
		ResourceStrings.timeout="Timeout";
		ResourceStrings.propertyDoesNotExist="PropertyDoesNotExist";
		ResourceStrings.attemptingToSetReadOnlyProperty="AttemptingToSetReadOnlyProperty";
		ResourceStrings.moreInfoInnerError="MoreInfoInnerError";
		ResourceStrings.cannotApplyPropertyThroughSetMethod="CannotApplyPropertyThroughSetMethod";
		ResourceStrings.valueNotLoaded="ValueNotLoaded";
		ResourceStrings.invalidOrTimedOutSessionMessage="InvalidOrTimedOutSessionMessage";
		return ResourceStrings;
	}());
	OfficeExtension.ResourceStrings=ResourceStrings;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var ResourceStringValues=(function () {
		function ResourceStringValues() {
		}
		ResourceStringValues.CannotRegisterEvent="The event handler cannot be registered.";
		ResourceStringValues.ConnectionFailureWithStatus="The request failed with status code of {0}.";
		ResourceStringValues.ConnectionFailureWithDetails="The request failed with status code of {0}, error code {1} and the following error message: {2}";
		ResourceStringValues.InvalidArgument="The argument '{0}' doesn't work for this situation, is missing, or isn't in the right format.";
		ResourceStringValues.InvalidObjectPath="The object path '{0}' isn't working for what you're trying to do. If you're using the object across multiple \"context.sync\" calls and outside the sequential execution of a \".run\" batch, please use the \"context.trackedObjects.add()\" and \"context.trackedObjects.remove()\" methods to manage the object's lifetime.";
		ResourceStringValues.InvalidRequestContext="Cannot use the object across different request contexts.";
		ResourceStringValues.PropertyNotLoaded="The property '{0}' is not available. Before reading the property's value, call the load method on the containing object and call \"context.sync()\" on the associated request context.";
		ResourceStringValues.RunMustReturnPromise="The batch function passed to the \".run\" method didn't return a promise. The function must return a promise, so that any automatically-tracked objects can be released at the completion of the batch operation. Typically, you return a promise by returning the response from \"context.sync()\".";
		ResourceStringValues.Timeout="The operation has timed out.";
		ResourceStringValues.ValueNotLoaded="The value of the result object has not been loaded yet. Before reading the value property, call \"context.sync()\" on the associated request context.";
		ResourceStringValues.invalidOrTimedOutSessionMessage="Your Office Online session has expired or is invalid. To continue, refresh the page.";
		return ResourceStringValues;
	}());
	OfficeExtension.ResourceStringValues=ResourceStringValues;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var RichApiMessageUtility=(function () {
		function RichApiMessageUtility() {
		}
		RichApiMessageUtility.buildMessageArrayForIRequestExecutor=function (customData, requestFlags, requestMessage, sourceLibHeaderValue) {
			var requestMessageText=JSON.stringify(requestMessage.Body);
			OfficeExtension.Utility.log("Request:");
			OfficeExtension.Utility.log(requestMessageText);
			var headers={};
			headers[OfficeExtension.Constants.sourceLibHeader]=sourceLibHeaderValue;
			var messageSafearray=RichApiMessageUtility.buildRequestMessageSafeArray(customData, requestFlags, "POST", "ProcessQuery", headers, requestMessageText);
			return messageSafearray;
		};
		RichApiMessageUtility.buildResponseOnSuccess=function (responseBody, responseHeaders) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.Body=JSON.parse(responseBody);
			response.Headers=responseHeaders;
			return response;
		};
		RichApiMessageUtility.buildResponseOnError=function (errorCode, message) {
			var response={ ErrorCode: '', ErrorMessage: '', Headers: null, Body: null };
			response.ErrorCode=OfficeExtension.ErrorCodes.generalException;
			response.ErrorMessage=message;
			if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability) {
				response.ErrorCode=OfficeExtension.ErrorCodes.accessDenied;
			}
			else if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached) {
				response.ErrorCode=OfficeExtension.ErrorCodes.activityLimitReached;
			}
			else if (errorCode==RichApiMessageUtility.OfficeJsErrorCode_ooeInvalidOrTimedOutSession) {
				response.ErrorCode=OfficeExtension.ErrorCodes.invalidOrTimedOutSession;
				response.ErrorMessage=OfficeExtension.Utility._getResourceString(OfficeExtension.ResourceStrings.invalidOrTimedOutSessionMessage);
			}
			return response;
		};
		RichApiMessageUtility.buildHttpResponseFromOfficeJsError=function (errorCode, message) {
			var statusCode=500;
			var errorBody={};
			errorBody["error"]={};
			errorBody["error"]["code"]=OfficeExtension.ErrorCodes.generalException;
			errorBody["error"]["message"]=message;
			if (errorCode===RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability) {
				statusCode=403;
				errorBody["error"]["code"]=OfficeExtension.ErrorCodes.accessDenied;
			}
			else if (errorCode===RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached) {
				statusCode=429;
				errorBody["error"]["code"]=OfficeExtension.ErrorCodes.activityLimitReached;
			}
			return { statusCode: statusCode, headers: {}, body: JSON.stringify(errorBody) };
		};
		RichApiMessageUtility.buildRequestMessageSafeArray=function (customData, requestFlags, method, path, headers, body) {
			var headerArray=[];
			if (headers) {
				for (var headerName in headers) {
					headerArray.push(headerName);
					headerArray.push(headers[headerName]);
				}
			}
			var appPermission=0;
			var solutionId="";
			var instanceId="";
			var marketplaceType="";
			return [
				customData,
				method,
				path,
				headerArray,
				body,
				appPermission,
				requestFlags,
				solutionId,
				instanceId,
				marketplaceType
			];
		};
		RichApiMessageUtility.getResponseBody=function (result) {
			return RichApiMessageUtility.getResponseBodyFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseHeaders=function (result) {
			return RichApiMessageUtility.getResponseHeadersFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseBodyFromSafeArray=function (data) {
			var ret=data[2];
			if (typeof (ret)==="string") {
				return ret;
			}
			var arr=ret;
			return arr.join("");
		};
		RichApiMessageUtility.getResponseHeadersFromSafeArray=function (data) {
			var arrayHeader=data[1];
			if (!arrayHeader) {
				return null;
			}
			var headers={};
			for (var i=0; i < arrayHeader.length - 1; i+=2) {
				headers[arrayHeader[i]]=arrayHeader[i+1];
			}
			return headers;
		};
		RichApiMessageUtility.getResponseStatusCode=function (result) {
			return RichApiMessageUtility.getResponseStatusCodeFromSafeArray(result.value.data);
		};
		RichApiMessageUtility.getResponseStatusCodeFromSafeArray=function (data) {
			return data[0];
		};
		RichApiMessageUtility.OfficeJsErrorCode_ooeInvalidOrTimedOutSession=5012;
		RichApiMessageUtility.OfficeJsErrorCode_ooeActivityLimitReached=5102;
		RichApiMessageUtility.OfficeJsErrorCode_ooeNoCapability=7000;
		return RichApiMessageUtility;
	}());
	OfficeExtension.RichApiMessageUtility=RichApiMessageUtility;
})(OfficeExtension || (OfficeExtension={}));
var OfficeExtension;
(function (OfficeExtension) {
	var Utility=(function () {
		function Utility() {
		}
		Utility.checkArgumentNull=function (value, name) {
			if (Utility.isNullOrUndefined(value)) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError(name);
			}
		};
		Utility.isNullOrUndefined=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isUndefined=function (value) {
			if (typeof (value)==="undefined") {
				return true;
			}
			return false;
		};
		Utility.isNullOrEmptyString=function (value) {
			if (value===null) {
				return true;
			}
			if (typeof (value)==="undefined") {
				return true;
			}
			if (value.length==0) {
				return true;
			}
			return false;
		};
		Utility.isPlainJsonObject=function (value) {
			if (Utility.isNullOrUndefined(value)) {
				return false;
			}
			if (typeof (value) !=="object") {
				return false;
			}
			return Object.getPrototypeOf(value)===Object.getPrototypeOf({});
		};
		Utility.trim=function (str) {
			return str.replace(new RegExp("^\\s+|\\s+$", "g"), "");
		};
		Utility.caseInsensitiveCompareString=function (str1, str2) {
			if (Utility.isNullOrUndefined(str1)) {
				return Utility.isNullOrUndefined(str2);
			}
			else {
				if (Utility.isNullOrUndefined(str2)) {
					return false;
				}
				else {
					return str1.toUpperCase()==str2.toUpperCase();
				}
			}
		};
		Utility.adjustToDateTime=function (value) {
			if (Utility.isNullOrUndefined(value)) {
				return null;
			}
			if (typeof (value)==="string") {
				return new Date(value);
			}
			if (Array.isArray(value)) {
				var arr=value;
				for (var i=0; i < arr.length; i++) {
					arr[i]=Utility.adjustToDateTime(arr[i]);
				}
				return arr;
			}
			throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("date");
		};
		Utility.isReadonlyRestRequest=function (method) {
			return Utility.caseInsensitiveCompareString(method, "GET");
		};
		Utility.setMethodArguments=function (context, argumentInfo, args) {
			if (Utility.isNullOrUndefined(args)) {
				return null;
			}
			var referencedObjectPaths=new Array();
			var referencedObjectPathIds=new Array();
			var hasOne=Utility.collectObjectPathInfos(context, args, referencedObjectPaths, referencedObjectPathIds);
			argumentInfo.Arguments=args;
			if (hasOne) {
				argumentInfo.ReferencedObjectPathIds=referencedObjectPathIds;
				return referencedObjectPaths;
			}
			return null;
		};
		Utility.collectObjectPathInfos=function (context, args, referencedObjectPaths, referencedObjectPathIds) {
			var hasOne=false;
			for (var i=0; i < args.length; i++) {
				if (args[i] instanceof OfficeExtension.ClientObject) {
					var clientObject=args[i];
					Utility.validateContext(context, clientObject);
					args[i]=clientObject._objectPath.objectPathInfo.Id;
					referencedObjectPathIds.push(clientObject._objectPath.objectPathInfo.Id);
					referencedObjectPaths.push(clientObject._objectPath);
					hasOne=true;
				}
				else if (Array.isArray(args[i])) {
					var childArrayObjectPathIds=new Array();
					var childArrayHasOne=Utility.collectObjectPathInfos(context, args[i], referencedObjectPaths, childArrayObjectPathIds);
					if (childArrayHasOne) {
						referencedObjectPathIds.push(childArrayObjectPathIds);
						hasOne=true;
					}
					else {
						referencedObjectPathIds.push(0);
					}
				}
				else {
					referencedObjectPathIds.push(0);
				}
			}
			return hasOne;
		};
		Utility.fixObjectPathIfNecessary=function (clientObject, value) {
			if (clientObject && clientObject._objectPath && value) {
				clientObject._objectPath.updateUsingObjectData(value);
			}
		};
		Utility.validateObjectPath=function (clientObject) {
			var objectPath=clientObject._objectPath;
			while (objectPath) {
				if (!objectPath.isValid) {
					throw new OfficeExtension._Internal.RuntimeError({
						code: OfficeExtension.ErrorCodes.invalidObjectPath,
						message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, Utility.getObjectPathExpression(objectPath)),
						debugInfo: {
							errorLocation: Utility.getObjectPathExpression(objectPath)
						}
					});
				}
				objectPath=objectPath.parentObjectPath;
			}
		};
		Utility.validateReferencedObjectPaths=function (objectPaths) {
			if (objectPaths) {
				for (var i=0; i < objectPaths.length; i++) {
					var objectPath=objectPaths[i];
					while (objectPath) {
						if (!objectPath.isValid) {
							throw new OfficeExtension._Internal.RuntimeError({
								code: OfficeExtension.ErrorCodes.invalidObjectPath,
								message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidObjectPath, Utility.getObjectPathExpression(objectPath))
							});
						}
						objectPath=objectPath.parentObjectPath;
					}
				}
			}
		};
		Utility.validateContext=function (context, obj) {
			if (obj && obj.context !==context) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.invalidRequestContext,
					message: Utility._getResourceString(OfficeExtension.ResourceStrings.invalidRequestContext)
				});
			}
		};
		Utility.log=function (message) {
			if (Utility._logEnabled && typeof (console) !=="undefined" && console.log) {
				console.log(message);
			}
		};
		Utility.load=function (clientObj, option) {
			clientObj.context.load(clientObj, option);
		};
		Utility._parseSelectExpand=function (select) {
			var args=[];
			if (!Utility.isNullOrEmptyString(select)) {
				var propertyNames=select.split(",");
				for (var i=0; i < propertyNames.length; i++) {
					var propertyName=propertyNames[i];
					propertyName=sanitizeForAnyItemsSlash(propertyName.trim());
					if (propertyName.length > 0) {
						args.push(propertyName);
					}
				}
			}
			return args;
			function sanitizeForAnyItemsSlash(propertyName) {
				var propertyNameLower=propertyName.toLowerCase();
				if (propertyNameLower==="items" || propertyNameLower==="items/") {
					return '*';
				}
				var itemsSlashLength=6;
				if (propertyNameLower.substr(0, itemsSlashLength)==="items/") {
					propertyName=propertyName.substr(itemsSlashLength);
				}
				return propertyName.replace(new RegExp("\/items\/", "gi"), "/");
			}
		};
		Utility.throwError=function (resourceId, arg, errorLocation) {
			throw new OfficeExtension._Internal.RuntimeError({
				code: resourceId,
				message: Utility._getResourceString(resourceId, arg),
				debugInfo: errorLocation ? { errorLocation: errorLocation } : undefined
			});
		};
		Utility.createRuntimeError=function (code, message, location) {
			return (new OfficeExtension._Internal.RuntimeError({
				code: code,
				message: message,
				debugInfo: { errorLocation: location }
			}));
		};
		Utility._getResourceString=function (resourceId, arg) {
			var ret;
			if (typeof (window) !=="undefined" && window.Strings && window.Strings.OfficeOM) {
				var stringName="L_"+resourceId;
				var stringValue=window.Strings.OfficeOM[stringName];
				if (stringValue) {
					ret=stringValue;
				}
			}
			if (!ret) {
				ret=OfficeExtension.ResourceStringValues[resourceId];
			}
			if (!ret) {
				ret=resourceId;
			}
			if (!Utility.isNullOrUndefined(arg)) {
				if (Array.isArray(arg)) {
					var arrArg=arg;
					ret=Utility._formatString(ret, arrArg);
				}
				else {
					ret=ret.replace("{0}", arg);
				}
			}
			return ret;
		};
		Utility._formatString=function (format, arrArg) {
			return format.replace(/\{\d\}/g, function (v) {
				var position=parseInt(v.substr(1, v.length - 2));
				if (position < arrArg.length) {
					return arrArg[position];
				}
				else {
					throw OfficeExtension._Internal.RuntimeError._createInvalidArgError("format");
				}
			});
		};
		Utility.throwIfNotLoaded=function (propertyName, fieldValue, entityName, isNull) {
			if (!isNull && Utility.isUndefined(fieldValue) && propertyName.charCodeAt(0) !=Utility.s_underscoreCharCode) {
				throw new OfficeExtension._Internal.RuntimeError({
					code: OfficeExtension.ErrorCodes.propertyNotLoaded,
					message: Utility._getResourceString(OfficeExtension.ResourceStrings.propertyNotLoaded, propertyName),
					debugInfo: entityName ? { errorLocation: entityName+"."+propertyName } : undefined
				});
			}
		};
		Utility.getObjectPathExpression=function (objectPath) {
			var ret="";
			while (objectPath) {
				switch (objectPath.objectPathInfo.ObjectPathType) {
					case 1:
						ret=ret;
						break;
					case 2:
						ret="new()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 3:
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+"()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 4:
						ret=Utility.normalizeName(objectPath.objectPathInfo.Name)+(ret.length > 0 ? "." : "")+ret;
						break;
					case 5:
						ret="getItem()"+(ret.length > 0 ? "." : "")+ret;
						break;
					case 6:
						ret="_reference()"+(ret.length > 0 ? "." : "")+ret;
						break;
				}
				objectPath=objectPath.parentObjectPath;
			}
			return ret;
		};
		Utility._createPromiseFromResult=function (value) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				resolve(value);
			});
		};
		Utility._createTimeoutPromise=function (timeout) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				setTimeout(function () {
					resolve(null);
				}, timeout);
			});
		};
		Utility.promisify=function (action) {
			return new OfficeExtension._Internal.OfficePromise(function (resolve, reject) {
				var callback=function (result) {
					if (result.status=="failed") {
						reject(result.error);
					}
					else {
						resolve(result.value);
					}
				};
				action(callback);
			});
		};
		Utility._addActionResultHandler=function (clientObj, action, resultHandler) {
			clientObj.context._pendingRequest.addActionResultHandler(action, resultHandler);
		};
		Utility._handleNavigationPropertyResults=function (clientObj, objectValue, propertyNames) {
			for (var i=0; i < propertyNames.length - 1; i+=2) {
				if (!Utility.isUndefined(objectValue[propertyNames[i+1]])) {
					clientObj[propertyNames[i]]._handleResult(objectValue[propertyNames[i+1]]);
				}
			}
		};
		Utility.normalizeName=function (name) {
			return name.substr(0, 1).toLowerCase()+name.substr(1);
		};
		Utility._isLocalDocumentUrl=function (url) {
			return Utility._getLocalDocumentUrlPrefixLength(url) > 0;
		};
		Utility._getLocalDocumentUrlPrefixLength=function (url) {
			var localDocumentPrefixes=["http://document.localhost", "https://document.localhost", "//document.localhost"];
			var urlLower=url.toLowerCase().trim();
			for (var i=0; i < localDocumentPrefixes.length; i++) {
				if (urlLower===localDocumentPrefixes[i]) {
					return localDocumentPrefixes[i].length;
				}
				else if (urlLower.substr(0, localDocumentPrefixes[i].length+1)===localDocumentPrefixes[i]+"/") {
					return localDocumentPrefixes[i].length+1;
				}
			}
			return 0;
		};
		Utility._validateLocalDocumentRequest=function (request) {
			var index=Utility._getLocalDocumentUrlPrefixLength(request.url);
			if (index <=0) {
				throw OfficeExtension._Internal.RuntimeError._createInvalidArgError({
					argumentName: "request"
				});
			}
			var path=request.url.substr(index);
			var pathLower=path.toLowerCase();
			if (pathLower==="_api") {
				path="";
			}
			else if (pathLower.substr(0, "_api/".length)==="_api/") {
				path=path.substr("_api/".length);
			}
			return {
				method: request.method,
				url: path,
				headers: request.headers,
				body: request.body
			};
		};
		Utility._buildRequestMessageSafeArray=function (request) {
			var requestFlags=0;
			if (!Utility.isReadonlyRestRequest(request.method)) {
				requestFlags=1;
			}
			if (request.url.substr(0, OfficeExtension.Constants.processQuery.length).toLowerCase()===OfficeExtension.Constants.processQuery.toLowerCase()) {
				var index=request.url.indexOf("?");
				if (index > 0) {
					var queryString=request.url.substr(index+1);
					var parts=queryString.split("&");
					for (var i=0; i < parts.length; i++) {
						var keyvalue=parts[i].split("=");
						if (keyvalue[0].toLowerCase()===OfficeExtension.Constants.flags) {
							var flags=parseInt(keyvalue[1]);
							requestFlags=flags;
							requestFlags=requestFlags & 1;
							break;
						}
					}
				}
			}
			return OfficeExtension.RichApiMessageUtility.buildRequestMessageSafeArray("", requestFlags, request.method, request.url, request.headers, request.body);
		};
		Utility._parseHttpResponseHeaders=function (allResponseHeaders) {
			var responseHeaders={};
			if (!Utility.isNullOrEmptyString(allResponseHeaders)) {
				var regex=new RegExp("\r?\n");
				var entries=allResponseHeaders.split(regex);
				for (var i=0; i < entries.length; i++) {
					var entry=entries[i];
					if (entry !=null) {
						var index=entry.indexOf(':');
						if (index > 0) {
							var key=entry.substr(0, index);
							var value=entry.substr(index+1);
							key=Utility.trim(key);
							value=Utility.trim(value);
							responseHeaders[key.toUpperCase()]=value;
						}
					}
				}
			}
			return responseHeaders;
		};
		Utility._parseErrorResponse=function (responseInfo) {
			var errorObj=null;
			if (!Utility.isNullOrEmptyString(responseInfo.body)) {
				var errorResponseBody=Utility.trim(responseInfo.body);
				try {
					errorObj=JSON.parse(errorResponseBody);
				}
				catch (e) {
					Utility.log("Error when parse "+errorResponseBody);
				}
			}
			var errorMessage;
			var errorCode;
			if (!Utility.isNullOrUndefined(errorObj) && typeof (errorObj)==="object" && errorObj.error) {
				errorCode=errorObj.error.code;
				errorMessage=Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithDetails, [responseInfo.statusCode.toString(), errorObj.error.code, errorObj.error.message]);
			}
			else {
				errorMessage=Utility._getResourceString(OfficeExtension.ResourceStrings.connectionFailureWithStatus, responseInfo.statusCode.toString());
			}
			if (Utility.isNullOrEmptyString(errorCode)) {
				errorCode=OfficeExtension.ErrorCodes.connectionFailure;
			}
			return { errorCode: errorCode, errorMessage: errorMessage };
		};
		Utility._copyHeaders=function (src, dest) {
			if (src && dest) {
				for (var key in src) {
					dest[key]=src[key];
				}
			}
		};
		Utility._logEnabled=false;
		Utility._synchronousCleanup=false;
		Utility.s_underscoreCharCode="_".charCodeAt(0);
		return Utility;
	}());
	OfficeExtension.Utility=Utility;
})(OfficeExtension || (OfficeExtension={}));

var __extends=(this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype, new __());
};
var Word;
(function (Word) {
	function _normalizeSearchOptions(context, searchOptions) {
		if (OfficeExtension.Utility.isNullOrUndefined(searchOptions)) {
			return null;
		}
		if (typeof (searchOptions) !="object") {
			OfficeExtension.Utility.throwError(OfficeExtension.ResourceStrings.invalidArgument, "searchOptions");
		}
		if (searchOptions instanceof Word.SearchOptions) {
			return searchOptions;
		}
		var newSearchOptions=Word.SearchOptions.newObject(context);
		for (var property in searchOptions) {
			if (searchOptions.hasOwnProperty(property)) {
				newSearchOptions[property]=searchOptions[property];
			}
		}
		return newSearchOptions;
	}
	var _createPropertyObjectPath=OfficeExtension.ObjectPathFactory.createPropertyObjectPath;
	var _createMethodObjectPath=OfficeExtension.ObjectPathFactory.createMethodObjectPath;
	var _createIndexerObjectPath=OfficeExtension.ObjectPathFactory.createIndexerObjectPath;
	var _createNewObjectObjectPath=OfficeExtension.ObjectPathFactory.createNewObjectObjectPath;
	var _createChildItemObjectPathUsingIndexer=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexer;
	var _createChildItemObjectPathUsingGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingGetItemAt;
	var _createChildItemObjectPathUsingIndexerOrGetItemAt=OfficeExtension.ObjectPathFactory.createChildItemObjectPathUsingIndexerOrGetItemAt;
	var _createMethodAction=OfficeExtension.ActionFactory.createMethodAction;
	var _createSetPropertyAction=OfficeExtension.ActionFactory.createSetPropertyAction;
	var _isNullOrUndefined=OfficeExtension.Utility.isNullOrUndefined;
	var _isUndefined=OfficeExtension.Utility.isUndefined;
	var _throwIfNotLoaded=OfficeExtension.Utility.throwIfNotLoaded;
	var _load=OfficeExtension.Utility.load;
	var _fixObjectPathIfNecessary=OfficeExtension.Utility.fixObjectPathIfNecessary;
	var _addActionResultHandler=OfficeExtension.Utility._addActionResultHandler;
	var _handleNavigationPropertyResults=OfficeExtension.Utility._handleNavigationPropertyResults;
	var _adjustToDateTime=OfficeExtension.Utility.adjustToDateTime;
	var Body=(function (_super) {
		__extends(Body, _super);
		function Body() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Body.prototype, "_className", {
			get: function () {
				return "Body";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "contentControls", {
			get: function () {
				if (!this.m_contentControls) {
					this.m_contentControls=new Word.ContentControlCollection(this.context, _createPropertyObjectPath(this.context, this, "ContentControls", true, false));
				}
				return this.m_contentControls;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "inlinePictures", {
			get: function () {
				if (!this.m_inlinePictures) {
					this.m_inlinePictures=new Word.InlinePictureCollection(this.context, _createPropertyObjectPath(this.context, this, "InlinePictures", true, false));
				}
				return this.m_inlinePictures;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "lists", {
			get: function () {
				if (!this.m_lists) {
					this.m_lists=new Word.ListCollection(this.context, _createPropertyObjectPath(this.context, this, "Lists", true, false));
				}
				return this.m_lists;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "paragraphs", {
			get: function () {
				if (!this.m_paragraphs) {
					this.m_paragraphs=new Word.ParagraphCollection(this.context, _createPropertyObjectPath(this.context, this, "Paragraphs", true, false));
				}
				return this.m_paragraphs;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentBody", {
			get: function () {
				if (!this.m_parentBody) {
					this.m_parentBody=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBody", false, false));
				}
				return this.m_parentBody;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentBodyOrNullObject", {
			get: function () {
				if (!this.m_parentBodyOrNullObject) {
					this.m_parentBodyOrNullObject=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBodyOrNullObject", false, false));
				}
				return this.m_parentBodyOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentSection", {
			get: function () {
				if (!this.m_parentSection) {
					this.m_parentSection=new Word.Section(this.context, _createPropertyObjectPath(this.context, this, "ParentSection", false, false));
				}
				return this.m_parentSection;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "parentSectionOrNullObject", {
			get: function () {
				if (!this.m_parentSectionOrNullObject) {
					this.m_parentSectionOrNullObject=new Word.Section(this.context, _createPropertyObjectPath(this.context, this, "ParentSectionOrNullObject", false, false));
				}
				return this.m_parentSectionOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Word.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "Body", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "styleBuiltIn", {
			get: function () {
				_throwIfNotLoaded("styleBuiltIn", this.m_styleBuiltIn, "Body", this._isNull);
				return this.m_styleBuiltIn;
			},
			set: function (value) {
				this.m_styleBuiltIn=value;
				_createSetPropertyAction(this.context, this, "StyleBuiltIn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "Body", this._isNull);
				return this.m_text;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "Body", this._isNull);
				return this.m_type;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Body.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Body", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Body.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["style", "styleBuiltIn"], ["font"], [
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentBodyOrNullObject",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentSection",
				"parentSectionOrNullObject",
				"tables",
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentBodyOrNullObject",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentSection",
				"parentSectionOrNullObject",
				"tables"
			]);
		};
		Body.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		Body.prototype.getHtml=function () {
			var action=_createMethodAction(this.context, this, "GetHtml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Body.prototype.getOoxml=function () {
			var action=_createMethodAction(this.context, this, "GetOoxml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Body.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		Body.prototype.insertBreak=function (breakType, insertLocation) {
			_createMethodAction(this.context, this, "InsertBreak", 0, [breakType, insertLocation]);
		};
		Body.prototype.insertContentControl=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "InsertContentControl", 0, [], false, true, null));
		};
		Body.prototype.insertFileFromBase64=function (base64File, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertFileFromBase64", 0, [base64File, insertLocation], false, true, null));
		};
		Body.prototype.insertHtml=function (html, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertHtml", 0, [html, insertLocation], false, true, null));
		};
		Body.prototype.insertInlinePictureFromBase64=function (base64EncodedImage, insertLocation) {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "InsertInlinePictureFromBase64", 0, [base64EncodedImage, insertLocation], false, true, null));
		};
		Body.prototype.insertOoxml=function (ooxml, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertOoxml", 0, [ooxml, insertLocation], false, true, null));
		};
		Body.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		Body.prototype.insertTable=function (rowCount, columnCount, insertLocation, values) {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "InsertTable", 0, [rowCount, columnCount, insertLocation, values], false, true, null));
		};
		Body.prototype.insertText=function (text, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertText", 0, [text, insertLocation], false, true, null));
		};
		Body.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		Body.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		Body.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Body.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["StyleBuiltIn"])) {
				this.m_styleBuiltIn=obj["StyleBuiltIn"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["contentControls", "ContentControls", "font", "Font", "inlinePictures", "InlinePictures", "lists", "Lists", "paragraphs", "Paragraphs", "parentBody", "ParentBody", "parentBodyOrNullObject", "ParentBodyOrNullObject", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentSection", "ParentSection", "parentSectionOrNullObject", "ParentSectionOrNullObject", "tables", "Tables"]);
		};
		Body.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Body.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		Body.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Body.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Body.prototype.toJSON=function () {
			return {
				"font": this.m_font,
				"style": this.m_style,
				"styleBuiltIn": this.m_styleBuiltIn,
				"text": this.m_text,
				"type": this.m_type
			};
		};
		return Body;
	}(OfficeExtension.ClientObject));
	Word.Body=Body;
	var ContentControl=(function (_super) {
		__extends(ContentControl, _super);
		function ContentControl() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ContentControl.prototype, "_className", {
			get: function () {
				return "ContentControl";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "contentControls", {
			get: function () {
				if (!this.m_contentControls) {
					this.m_contentControls=new Word.ContentControlCollection(this.context, _createPropertyObjectPath(this.context, this, "ContentControls", true, false));
				}
				return this.m_contentControls;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "inlinePictures", {
			get: function () {
				if (!this.m_inlinePictures) {
					this.m_inlinePictures=new Word.InlinePictureCollection(this.context, _createPropertyObjectPath(this.context, this, "InlinePictures", true, false));
				}
				return this.m_inlinePictures;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "lists", {
			get: function () {
				if (!this.m_lists) {
					this.m_lists=new Word.ListCollection(this.context, _createPropertyObjectPath(this.context, this, "Lists", true, false));
				}
				return this.m_lists;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "paragraphs", {
			get: function () {
				if (!this.m_paragraphs) {
					this.m_paragraphs=new Word.ParagraphCollection(this.context, _createPropertyObjectPath(this.context, this, "Paragraphs", true, false));
				}
				return this.m_paragraphs;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentBody", {
			get: function () {
				if (!this.m_parentBody) {
					this.m_parentBody=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBody", false, false));
				}
				return this.m_parentBody;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentTableCell", {
			get: function () {
				if (!this.m_parentTableCell) {
					this.m_parentTableCell=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCell", false, false));
				}
				return this.m_parentTableCell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentTableCellOrNullObject", {
			get: function () {
				if (!this.m_parentTableCellOrNullObject) {
					this.m_parentTableCellOrNullObject=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCellOrNullObject", false, false));
				}
				return this.m_parentTableCellOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "parentTableOrNullObject", {
			get: function () {
				if (!this.m_parentTableOrNullObject) {
					this.m_parentTableOrNullObject=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTableOrNullObject", false, false));
				}
				return this.m_parentTableOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Word.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "appearance", {
			get: function () {
				_throwIfNotLoaded("appearance", this.m_appearance, "ContentControl", this._isNull);
				return this.m_appearance;
			},
			set: function (value) {
				this.m_appearance=value;
				_createSetPropertyAction(this.context, this, "Appearance", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "cannotDelete", {
			get: function () {
				_throwIfNotLoaded("cannotDelete", this.m_cannotDelete, "ContentControl", this._isNull);
				return this.m_cannotDelete;
			},
			set: function (value) {
				this.m_cannotDelete=value;
				_createSetPropertyAction(this.context, this, "CannotDelete", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "cannotEdit", {
			get: function () {
				_throwIfNotLoaded("cannotEdit", this.m_cannotEdit, "ContentControl", this._isNull);
				return this.m_cannotEdit;
			},
			set: function (value) {
				this.m_cannotEdit=value;
				_createSetPropertyAction(this.context, this, "CannotEdit", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "ContentControl", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "ContentControl", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "placeholderText", {
			get: function () {
				_throwIfNotLoaded("placeholderText", this.m_placeholderText, "ContentControl", this._isNull);
				return this.m_placeholderText;
			},
			set: function (value) {
				this.m_placeholderText=value;
				_createSetPropertyAction(this.context, this, "PlaceholderText", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "removeWhenEdited", {
			get: function () {
				_throwIfNotLoaded("removeWhenEdited", this.m_removeWhenEdited, "ContentControl", this._isNull);
				return this.m_removeWhenEdited;
			},
			set: function (value) {
				this.m_removeWhenEdited=value;
				_createSetPropertyAction(this.context, this, "RemoveWhenEdited", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "ContentControl", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "styleBuiltIn", {
			get: function () {
				_throwIfNotLoaded("styleBuiltIn", this.m_styleBuiltIn, "ContentControl", this._isNull);
				return this.m_styleBuiltIn;
			},
			set: function (value) {
				this.m_styleBuiltIn=value;
				_createSetPropertyAction(this.context, this, "StyleBuiltIn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "subtype", {
			get: function () {
				_throwIfNotLoaded("subtype", this.m_subtype, "ContentControl", this._isNull);
				return this.m_subtype;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "tag", {
			get: function () {
				_throwIfNotLoaded("tag", this.m_tag, "ContentControl", this._isNull);
				return this.m_tag;
			},
			set: function (value) {
				this.m_tag=value;
				_createSetPropertyAction(this.context, this, "Tag", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "ContentControl", this._isNull);
				return this.m_text;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "title", {
			get: function () {
				_throwIfNotLoaded("title", this.m_title, "ContentControl", this._isNull);
				return this.m_title;
			},
			set: function (value) {
				this.m_title=value;
				_createSetPropertyAction(this.context, this, "Title", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "ContentControl", this._isNull);
				return this.m_type;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControl.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "ContentControl", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		ContentControl.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["title", "tag", "placeholderText", "appearance", "color", "removeWhenEdited", "cannotDelete", "cannotEdit", "style", "styleBuiltIn"], ["font"], [
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"tables",
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"tables"
			]);
		};
		ContentControl.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		ContentControl.prototype.delete=function (keepContent) {
			_createMethodAction(this.context, this, "Delete", 0, [keepContent]);
		};
		ContentControl.prototype.getHtml=function () {
			var action=_createMethodAction(this.context, this, "GetHtml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ContentControl.prototype.getOoxml=function () {
			var action=_createMethodAction(this.context, this, "GetOoxml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		ContentControl.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		ContentControl.prototype.getTextRanges=function (endingMarks, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "GetTextRanges", 1, [endingMarks, trimSpacing], true, false, null));
		};
		ContentControl.prototype.insertBreak=function (breakType, insertLocation) {
			_createMethodAction(this.context, this, "InsertBreak", 0, [breakType, insertLocation]);
		};
		ContentControl.prototype.insertFileFromBase64=function (base64File, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertFileFromBase64", 0, [base64File, insertLocation], false, true, null));
		};
		ContentControl.prototype.insertHtml=function (html, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertHtml", 0, [html, insertLocation], false, true, null));
		};
		ContentControl.prototype.insertInlinePictureFromBase64=function (base64EncodedImage, insertLocation) {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "InsertInlinePictureFromBase64", 0, [base64EncodedImage, insertLocation], false, true, null));
		};
		ContentControl.prototype.insertOoxml=function (ooxml, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertOoxml", 0, [ooxml, insertLocation], false, true, null));
		};
		ContentControl.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		ContentControl.prototype.insertTable=function (rowCount, columnCount, insertLocation, values) {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "InsertTable", 0, [rowCount, columnCount, insertLocation, values], false, true, null));
		};
		ContentControl.prototype.insertText=function (text, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertText", 0, [text, insertLocation], false, true, null));
		};
		ContentControl.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		ContentControl.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		ContentControl.prototype.split=function (delimiters, multiParagraphs, trimDelimiters, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Split", 1, [delimiters, multiParagraphs, trimDelimiters, trimSpacing], true, false, null));
		};
		ContentControl.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		ContentControl.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Appearance"])) {
				this.m_appearance=obj["Appearance"];
			}
			if (!_isUndefined(obj["CannotDelete"])) {
				this.m_cannotDelete=obj["CannotDelete"];
			}
			if (!_isUndefined(obj["CannotEdit"])) {
				this.m_cannotEdit=obj["CannotEdit"];
			}
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["PlaceholderText"])) {
				this.m_placeholderText=obj["PlaceholderText"];
			}
			if (!_isUndefined(obj["RemoveWhenEdited"])) {
				this.m_removeWhenEdited=obj["RemoveWhenEdited"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["StyleBuiltIn"])) {
				this.m_styleBuiltIn=obj["StyleBuiltIn"];
			}
			if (!_isUndefined(obj["Subtype"])) {
				this.m_subtype=obj["Subtype"];
			}
			if (!_isUndefined(obj["Tag"])) {
				this.m_tag=obj["Tag"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["Title"])) {
				this.m_title=obj["Title"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["contentControls", "ContentControls", "font", "Font", "inlinePictures", "InlinePictures", "lists", "Lists", "paragraphs", "Paragraphs", "parentBody", "ParentBody", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentTable", "ParentTable", "parentTableCell", "ParentTableCell", "parentTableCellOrNullObject", "ParentTableCellOrNullObject", "parentTableOrNullObject", "ParentTableOrNullObject", "tables", "Tables"]);
		};
		ContentControl.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ContentControl.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["Id"])) {
				this.m_id=value["Id"];
			}
		};
		ContentControl.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		ContentControl.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		ContentControl.prototype.toJSON=function () {
			return {
				"appearance": this.m_appearance,
				"cannotDelete": this.m_cannotDelete,
				"cannotEdit": this.m_cannotEdit,
				"color": this.m_color,
				"font": this.m_font,
				"id": this.m_id,
				"placeholderText": this.m_placeholderText,
				"removeWhenEdited": this.m_removeWhenEdited,
				"style": this.m_style,
				"styleBuiltIn": this.m_styleBuiltIn,
				"subtype": this.m_subtype,
				"tag": this.m_tag,
				"text": this.m_text,
				"title": this.m_title,
				"type": this.m_type
			};
		};
		return ContentControl;
	}(OfficeExtension.ClientObject));
	Word.ContentControl=ContentControl;
	var ContentControlCollection=(function (_super) {
		__extends(ContentControlCollection, _super);
		function ContentControlCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ContentControlCollection.prototype, "_className", {
			get: function () {
				return "ContentControlCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControlCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ContentControlCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ContentControlCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "ContentControlCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		ContentControlCollection.prototype.getById=function (id) {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "GetById", 1, [id], false, false, null));
		};
		ContentControlCollection.prototype.getByIdOrNullObject=function (id) {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "GetByIdOrNullObject", 1, [id], false, false, null));
		};
		ContentControlCollection.prototype.getByTag=function (tag) {
			return new Word.ContentControlCollection(this.context, _createMethodObjectPath(this.context, this, "GetByTag", 1, [tag], true, false, null));
		};
		ContentControlCollection.prototype.getByTitle=function (title) {
			return new Word.ContentControlCollection(this.context, _createMethodObjectPath(this.context, this, "GetByTitle", 1, [title], true, false, null));
		};
		ContentControlCollection.prototype.getByTypes=function (types) {
			return new Word.ContentControlCollection(this.context, _createMethodObjectPath(this.context, this, "GetByTypes", 1, [types], true, false, null));
		};
		ContentControlCollection.prototype.getFirst=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		ContentControlCollection.prototype.getFirstOrNullObject=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		ContentControlCollection.prototype.getItem=function (index) {
			return new Word.ContentControl(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		ContentControlCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		ContentControlCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.ContentControl(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ContentControlCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ContentControlCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		ContentControlCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		ContentControlCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		ContentControlCollection.prototype.toJSON=function () {
			return {};
		};
		return ContentControlCollection;
	}(OfficeExtension.ClientObject));
	Word.ContentControlCollection=ContentControlCollection;
	var CustomProperty=(function (_super) {
		__extends(CustomProperty, _super);
		function CustomProperty() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(CustomProperty.prototype, "_className", {
			get: function () {
				return "CustomProperty";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomProperty.prototype, "key", {
			get: function () {
				_throwIfNotLoaded("key", this.m_key, "CustomProperty", this._isNull);
				return this.m_key;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomProperty.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "CustomProperty", this._isNull);
				return this.m_type;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomProperty.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "CustomProperty", this._isNull);
				if (this.m_type=="Date") {
					_throwIfNotLoaded("value", this.m_value, "CustomProperty", this._isNull);
					return new Date(this.m_value);
				}
				_throwIfNotLoaded("value", this.m_value, "CustomProperty", this._isNull);
				return this.m_value;
			},
			set: function (value) {
				this.m_value=value;
				_createSetPropertyAction(this.context, this, "Value", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomProperty.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "CustomProperty", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomProperty.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "CustomProperty", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		CustomProperty.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["value"], [], []);
		};
		CustomProperty.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		CustomProperty.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		CustomProperty.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Key"])) {
				this.m_key=obj["Key"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
		};
		CustomProperty.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		CustomProperty.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		CustomProperty.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		CustomProperty.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		CustomProperty.prototype.toJSON=function () {
			return {
				"key": this.m_key,
				"type": this.m_type,
				"value": this.m_value
			};
		};
		return CustomProperty;
	}(OfficeExtension.ClientObject));
	Word.CustomProperty=CustomProperty;
	var CustomPropertyCollection=(function (_super) {
		__extends(CustomPropertyCollection, _super);
		function CustomPropertyCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(CustomPropertyCollection.prototype, "_className", {
			get: function () {
				return "CustomPropertyCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomPropertyCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "CustomPropertyCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CustomPropertyCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "CustomPropertyCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		CustomPropertyCollection.prototype.add=function (key, value) {
			return new Word.CustomProperty(this.context, _createMethodObjectPath(this.context, this, "Add", 0, [key, value], false, true, null));
		};
		CustomPropertyCollection.prototype.deleteAll=function () {
			_createMethodAction(this.context, this, "DeleteAll", 0, []);
		};
		CustomPropertyCollection.prototype.getCount=function () {
			var action=_createMethodAction(this.context, this, "GetCount", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		CustomPropertyCollection.prototype.getItem=function (key) {
			return new Word.CustomProperty(this.context, _createIndexerObjectPath(this.context, this, [key]));
		};
		CustomPropertyCollection.prototype.getItemOrNullObject=function (key) {
			return new Word.CustomProperty(this.context, _createMethodObjectPath(this.context, this, "GetItemOrNullObject", 1, [key], false, false, null));
		};
		CustomPropertyCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		CustomPropertyCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.CustomProperty(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		CustomPropertyCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		CustomPropertyCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		CustomPropertyCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		CustomPropertyCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		CustomPropertyCollection.prototype.toJSON=function () {
			return {};
		};
		return CustomPropertyCollection;
	}(OfficeExtension.ClientObject));
	Word.CustomPropertyCollection=CustomPropertyCollection;
	var Document=(function (_super) {
		__extends(Document, _super);
		function Document() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Document.prototype, "_className", {
			get: function () {
				return "Document";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "body", {
			get: function () {
				if (!this.m_body) {
					this.m_body=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "Body", false, false));
				}
				return this.m_body;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "contentControls", {
			get: function () {
				if (!this.m_contentControls) {
					this.m_contentControls=new Word.ContentControlCollection(this.context, _createPropertyObjectPath(this.context, this, "ContentControls", true, false));
				}
				return this.m_contentControls;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "properties", {
			get: function () {
				if (!this.m_properties) {
					this.m_properties=new Word.DocumentProperties(this.context, _createPropertyObjectPath(this.context, this, "Properties", false, false));
				}
				return this.m_properties;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "sections", {
			get: function () {
				if (!this.m_sections) {
					this.m_sections=new Word.SectionCollection(this.context, _createPropertyObjectPath(this.context, this, "Sections", true, false));
				}
				return this.m_sections;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "saved", {
			get: function () {
				_throwIfNotLoaded("saved", this.m_saved, "Document", this._isNull);
				return this.m_saved;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Document.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Document", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Document.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, [], ["body", "properties"], [
				"contentControls",
				"sections",
				"contentControls",
				"sections"
			]);
		};
		Document.prototype.getSelection=function () {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetSelection", 1, [], false, true, null));
		};
		Document.prototype.save=function () {
			_createMethodAction(this.context, this, "Save", 0, []);
		};
		Document.prototype._GetObjectByReferenceId=function (referenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectByReferenceId", 1, [referenceId]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Document.prototype._GetObjectTypeNameByReferenceId=function (referenceId) {
			var action=_createMethodAction(this.context, this, "_GetObjectTypeNameByReferenceId", 1, [referenceId]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Document.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Document.prototype._RemoveAllReferences=function () {
			_createMethodAction(this.context, this, "_RemoveAllReferences", 1, []);
		};
		Document.prototype._RemoveReference=function (referenceId) {
			_createMethodAction(this.context, this, "_RemoveReference", 1, [referenceId]);
		};
		Document.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Saved"])) {
				this.m_saved=obj["Saved"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["body", "Body", "contentControls", "ContentControls", "properties", "Properties", "sections", "Sections"]);
		};
		Document.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Document.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		Document.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Document.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Document.prototype.toJSON=function () {
			return {
				"body": this.m_body,
				"properties": this.m_properties,
				"saved": this.m_saved
			};
		};
		return Document;
	}(OfficeExtension.ClientObject));
	Word.Document=Document;
	var DocumentProperties=(function (_super) {
		__extends(DocumentProperties, _super);
		function DocumentProperties() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(DocumentProperties.prototype, "_className", {
			get: function () {
				return "DocumentProperties";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "customProperties", {
			get: function () {
				if (!this.m_customProperties) {
					this.m_customProperties=new Word.CustomPropertyCollection(this.context, _createPropertyObjectPath(this.context, this, "CustomProperties", true, false));
				}
				return this.m_customProperties;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "applicationName", {
			get: function () {
				_throwIfNotLoaded("applicationName", this.m_applicationName, "DocumentProperties", this._isNull);
				return this.m_applicationName;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "author", {
			get: function () {
				_throwIfNotLoaded("author", this.m_author, "DocumentProperties", this._isNull);
				return this.m_author;
			},
			set: function (value) {
				this.m_author=value;
				_createSetPropertyAction(this.context, this, "Author", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "category", {
			get: function () {
				_throwIfNotLoaded("category", this.m_category, "DocumentProperties", this._isNull);
				return this.m_category;
			},
			set: function (value) {
				this.m_category=value;
				_createSetPropertyAction(this.context, this, "Category", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "comments", {
			get: function () {
				_throwIfNotLoaded("comments", this.m_comments, "DocumentProperties", this._isNull);
				return this.m_comments;
			},
			set: function (value) {
				this.m_comments=value;
				_createSetPropertyAction(this.context, this, "Comments", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "company", {
			get: function () {
				_throwIfNotLoaded("company", this.m_company, "DocumentProperties", this._isNull);
				return this.m_company;
			},
			set: function (value) {
				this.m_company=value;
				_createSetPropertyAction(this.context, this, "Company", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "creationDate", {
			get: function () {
				_throwIfNotLoaded("creationDate", this.m_creationDate, "DocumentProperties", this._isNull);
				return this.m_creationDate;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "format", {
			get: function () {
				_throwIfNotLoaded("format", this.m_format, "DocumentProperties", this._isNull);
				return this.m_format;
			},
			set: function (value) {
				this.m_format=value;
				_createSetPropertyAction(this.context, this, "Format", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "keywords", {
			get: function () {
				_throwIfNotLoaded("keywords", this.m_keywords, "DocumentProperties", this._isNull);
				return this.m_keywords;
			},
			set: function (value) {
				this.m_keywords=value;
				_createSetPropertyAction(this.context, this, "Keywords", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "lastAuthor", {
			get: function () {
				_throwIfNotLoaded("lastAuthor", this.m_lastAuthor, "DocumentProperties", this._isNull);
				return this.m_lastAuthor;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "lastPrintDate", {
			get: function () {
				_throwIfNotLoaded("lastPrintDate", this.m_lastPrintDate, "DocumentProperties", this._isNull);
				return this.m_lastPrintDate;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "lastSaveTime", {
			get: function () {
				_throwIfNotLoaded("lastSaveTime", this.m_lastSaveTime, "DocumentProperties", this._isNull);
				return this.m_lastSaveTime;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "manager", {
			get: function () {
				_throwIfNotLoaded("manager", this.m_manager, "DocumentProperties", this._isNull);
				return this.m_manager;
			},
			set: function (value) {
				this.m_manager=value;
				_createSetPropertyAction(this.context, this, "Manager", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "revisionNumber", {
			get: function () {
				_throwIfNotLoaded("revisionNumber", this.m_revisionNumber, "DocumentProperties", this._isNull);
				return this.m_revisionNumber;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "security", {
			get: function () {
				_throwIfNotLoaded("security", this.m_security, "DocumentProperties", this._isNull);
				return this.m_security;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "subject", {
			get: function () {
				_throwIfNotLoaded("subject", this.m_subject, "DocumentProperties", this._isNull);
				return this.m_subject;
			},
			set: function (value) {
				this.m_subject=value;
				_createSetPropertyAction(this.context, this, "Subject", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "template", {
			get: function () {
				_throwIfNotLoaded("template", this.m_template, "DocumentProperties", this._isNull);
				return this.m_template;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "title", {
			get: function () {
				_throwIfNotLoaded("title", this.m_title, "DocumentProperties", this._isNull);
				return this.m_title;
			},
			set: function (value) {
				this.m_title=value;
				_createSetPropertyAction(this.context, this, "Title", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DocumentProperties.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "DocumentProperties", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		DocumentProperties.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["title", "subject", "author", "keywords", "comments", "category", "format", "manager", "company"], [], [
				"customProperties",
				"customProperties"
			]);
		};
		DocumentProperties.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		DocumentProperties.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["ApplicationName"])) {
				this.m_applicationName=obj["ApplicationName"];
			}
			if (!_isUndefined(obj["Author"])) {
				this.m_author=obj["Author"];
			}
			if (!_isUndefined(obj["Category"])) {
				this.m_category=obj["Category"];
			}
			if (!_isUndefined(obj["Comments"])) {
				this.m_comments=obj["Comments"];
			}
			if (!_isUndefined(obj["Company"])) {
				this.m_company=obj["Company"];
			}
			if (!_isUndefined(obj["CreationDate"])) {
				this.m_creationDate=_adjustToDateTime(obj["CreationDate"]);
			}
			if (!_isUndefined(obj["Format"])) {
				this.m_format=obj["Format"];
			}
			if (!_isUndefined(obj["Keywords"])) {
				this.m_keywords=obj["Keywords"];
			}
			if (!_isUndefined(obj["LastAuthor"])) {
				this.m_lastAuthor=obj["LastAuthor"];
			}
			if (!_isUndefined(obj["LastPrintDate"])) {
				this.m_lastPrintDate=_adjustToDateTime(obj["LastPrintDate"]);
			}
			if (!_isUndefined(obj["LastSaveTime"])) {
				this.m_lastSaveTime=_adjustToDateTime(obj["LastSaveTime"]);
			}
			if (!_isUndefined(obj["Manager"])) {
				this.m_manager=obj["Manager"];
			}
			if (!_isUndefined(obj["RevisionNumber"])) {
				this.m_revisionNumber=obj["RevisionNumber"];
			}
			if (!_isUndefined(obj["Security"])) {
				this.m_security=obj["Security"];
			}
			if (!_isUndefined(obj["Subject"])) {
				this.m_subject=obj["Subject"];
			}
			if (!_isUndefined(obj["Template"])) {
				this.m_template=obj["Template"];
			}
			if (!_isUndefined(obj["Title"])) {
				this.m_title=obj["Title"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["customProperties", "CustomProperties"]);
		};
		DocumentProperties.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		DocumentProperties.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		DocumentProperties.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		DocumentProperties.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		DocumentProperties.prototype.toJSON=function () {
			return {
				"applicationName": this.m_applicationName,
				"author": this.m_author,
				"category": this.m_category,
				"comments": this.m_comments,
				"company": this.m_company,
				"creationDate": this.m_creationDate,
				"format": this.m_format,
				"keywords": this.m_keywords,
				"lastAuthor": this.m_lastAuthor,
				"lastPrintDate": this.m_lastPrintDate,
				"lastSaveTime": this.m_lastSaveTime,
				"manager": this.m_manager,
				"revisionNumber": this.m_revisionNumber,
				"security": this.m_security,
				"subject": this.m_subject,
				"template": this.m_template,
				"title": this.m_title
			};
		};
		return DocumentProperties;
	}(OfficeExtension.ClientObject));
	Word.DocumentProperties=DocumentProperties;
	var Font=(function (_super) {
		__extends(Font, _super);
		function Font() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Font.prototype, "_className", {
			get: function () {
				return "Font";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "bold", {
			get: function () {
				_throwIfNotLoaded("bold", this.m_bold, "Font", this._isNull);
				return this.m_bold;
			},
			set: function (value) {
				this.m_bold=value;
				_createSetPropertyAction(this.context, this, "Bold", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "Font", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "doubleStrikeThrough", {
			get: function () {
				_throwIfNotLoaded("doubleStrikeThrough", this.m_doubleStrikeThrough, "Font", this._isNull);
				return this.m_doubleStrikeThrough;
			},
			set: function (value) {
				this.m_doubleStrikeThrough=value;
				_createSetPropertyAction(this.context, this, "DoubleStrikeThrough", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "highlightColor", {
			get: function () {
				_throwIfNotLoaded("highlightColor", this.m_highlightColor, "Font", this._isNull);
				return this.m_highlightColor;
			},
			set: function (value) {
				this.m_highlightColor=value;
				_createSetPropertyAction(this.context, this, "HighlightColor", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "italic", {
			get: function () {
				_throwIfNotLoaded("italic", this.m_italic, "Font", this._isNull);
				return this.m_italic;
			},
			set: function (value) {
				this.m_italic=value;
				_createSetPropertyAction(this.context, this, "Italic", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "name", {
			get: function () {
				_throwIfNotLoaded("name", this.m_name, "Font", this._isNull);
				return this.m_name;
			},
			set: function (value) {
				this.m_name=value;
				_createSetPropertyAction(this.context, this, "Name", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "size", {
			get: function () {
				_throwIfNotLoaded("size", this.m_size, "Font", this._isNull);
				return this.m_size;
			},
			set: function (value) {
				this.m_size=value;
				_createSetPropertyAction(this.context, this, "Size", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "strikeThrough", {
			get: function () {
				_throwIfNotLoaded("strikeThrough", this.m_strikeThrough, "Font", this._isNull);
				return this.m_strikeThrough;
			},
			set: function (value) {
				this.m_strikeThrough=value;
				_createSetPropertyAction(this.context, this, "StrikeThrough", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "subscript", {
			get: function () {
				_throwIfNotLoaded("subscript", this.m_subscript, "Font", this._isNull);
				return this.m_subscript;
			},
			set: function (value) {
				this.m_subscript=value;
				_createSetPropertyAction(this.context, this, "Subscript", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "superscript", {
			get: function () {
				_throwIfNotLoaded("superscript", this.m_superscript, "Font", this._isNull);
				return this.m_superscript;
			},
			set: function (value) {
				this.m_superscript=value;
				_createSetPropertyAction(this.context, this, "Superscript", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "underline", {
			get: function () {
				_throwIfNotLoaded("underline", this.m_underline, "Font", this._isNull);
				return this.m_underline;
			},
			set: function (value) {
				this.m_underline=value;
				_createSetPropertyAction(this.context, this, "Underline", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Font.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Font", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Font.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["name", "size", "bold", "italic", "color", "underline", "subscript", "superscript", "strikeThrough", "doubleStrikeThrough", "highlightColor"], [], []);
		};
		Font.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Font.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Bold"])) {
				this.m_bold=obj["Bold"];
			}
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["DoubleStrikeThrough"])) {
				this.m_doubleStrikeThrough=obj["DoubleStrikeThrough"];
			}
			if (!_isUndefined(obj["HighlightColor"])) {
				this.m_highlightColor=obj["HighlightColor"];
			}
			if (!_isUndefined(obj["Italic"])) {
				this.m_italic=obj["Italic"];
			}
			if (!_isUndefined(obj["Name"])) {
				this.m_name=obj["Name"];
			}
			if (!_isUndefined(obj["Size"])) {
				this.m_size=obj["Size"];
			}
			if (!_isUndefined(obj["StrikeThrough"])) {
				this.m_strikeThrough=obj["StrikeThrough"];
			}
			if (!_isUndefined(obj["Subscript"])) {
				this.m_subscript=obj["Subscript"];
			}
			if (!_isUndefined(obj["Superscript"])) {
				this.m_superscript=obj["Superscript"];
			}
			if (!_isUndefined(obj["Underline"])) {
				this.m_underline=obj["Underline"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
		};
		Font.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Font.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		Font.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Font.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Font.prototype.toJSON=function () {
			return {
				"bold": this.m_bold,
				"color": this.m_color,
				"doubleStrikeThrough": this.m_doubleStrikeThrough,
				"highlightColor": this.m_highlightColor,
				"italic": this.m_italic,
				"name": this.m_name,
				"size": this.m_size,
				"strikeThrough": this.m_strikeThrough,
				"subscript": this.m_subscript,
				"superscript": this.m_superscript,
				"underline": this.m_underline
			};
		};
		return Font;
	}(OfficeExtension.ClientObject));
	Word.Font=Font;
	var InlinePicture=(function (_super) {
		__extends(InlinePicture, _super);
		function InlinePicture() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(InlinePicture.prototype, "_className", {
			get: function () {
				return "InlinePicture";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "paragraph", {
			get: function () {
				if (!this.m_paragraph) {
					this.m_paragraph=new Word.Paragraph(this.context, _createPropertyObjectPath(this.context, this, "Paragraph", false, false));
				}
				return this.m_paragraph;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentTableCell", {
			get: function () {
				if (!this.m_parentTableCell) {
					this.m_parentTableCell=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCell", false, false));
				}
				return this.m_parentTableCell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentTableCellOrNullObject", {
			get: function () {
				if (!this.m_parentTableCellOrNullObject) {
					this.m_parentTableCellOrNullObject=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCellOrNullObject", false, false));
				}
				return this.m_parentTableCellOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "parentTableOrNullObject", {
			get: function () {
				if (!this.m_parentTableOrNullObject) {
					this.m_parentTableOrNullObject=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTableOrNullObject", false, false));
				}
				return this.m_parentTableOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "altTextDescription", {
			get: function () {
				_throwIfNotLoaded("altTextDescription", this.m_altTextDescription, "InlinePicture", this._isNull);
				return this.m_altTextDescription;
			},
			set: function (value) {
				this.m_altTextDescription=value;
				_createSetPropertyAction(this.context, this, "AltTextDescription", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "altTextTitle", {
			get: function () {
				_throwIfNotLoaded("altTextTitle", this.m_altTextTitle, "InlinePicture", this._isNull);
				return this.m_altTextTitle;
			},
			set: function (value) {
				this.m_altTextTitle=value;
				_createSetPropertyAction(this.context, this, "AltTextTitle", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "height", {
			get: function () {
				_throwIfNotLoaded("height", this.m_height, "InlinePicture", this._isNull);
				return this.m_height;
			},
			set: function (value) {
				this.m_height=value;
				_createSetPropertyAction(this.context, this, "Height", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "hyperlink", {
			get: function () {
				_throwIfNotLoaded("hyperlink", this.m_hyperlink, "InlinePicture", this._isNull);
				return this.m_hyperlink;
			},
			set: function (value) {
				this.m_hyperlink=value;
				_createSetPropertyAction(this.context, this, "Hyperlink", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "lockAspectRatio", {
			get: function () {
				_throwIfNotLoaded("lockAspectRatio", this.m_lockAspectRatio, "InlinePicture", this._isNull);
				return this.m_lockAspectRatio;
			},
			set: function (value) {
				this.m_lockAspectRatio=value;
				_createSetPropertyAction(this.context, this, "LockAspectRatio", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "width", {
			get: function () {
				_throwIfNotLoaded("width", this.m_width, "InlinePicture", this._isNull);
				return this.m_width;
			},
			set: function (value) {
				this.m_width=value;
				_createSetPropertyAction(this.context, this, "Width", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "InlinePicture", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePicture.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "InlinePicture", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		InlinePicture.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["altTextDescription", "altTextTitle", "height", "hyperlink", "lockAspectRatio", "width"], [], [
				"paragraph",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"paragraph",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject"
			]);
		};
		InlinePicture.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		InlinePicture.prototype.getBase64ImageSrc=function () {
			var action=_createMethodAction(this.context, this, "GetBase64ImageSrc", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		InlinePicture.prototype.getNext=function () {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		InlinePicture.prototype.getNextOrNullObject=function () {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		InlinePicture.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		InlinePicture.prototype.insertBreak=function (breakType, insertLocation) {
			_createMethodAction(this.context, this, "InsertBreak", 0, [breakType, insertLocation]);
		};
		InlinePicture.prototype.insertContentControl=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "InsertContentControl", 0, [], false, true, null));
		};
		InlinePicture.prototype.insertFileFromBase64=function (base64File, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertFileFromBase64", 0, [base64File, insertLocation], false, true, null));
		};
		InlinePicture.prototype.insertHtml=function (html, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertHtml", 0, [html, insertLocation], false, true, null));
		};
		InlinePicture.prototype.insertInlinePictureFromBase64=function (base64EncodedImage, insertLocation) {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "InsertInlinePictureFromBase64", 0, [base64EncodedImage, insertLocation], false, true, null));
		};
		InlinePicture.prototype.insertOoxml=function (ooxml, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertOoxml", 0, [ooxml, insertLocation], false, true, null));
		};
		InlinePicture.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		InlinePicture.prototype.insertText=function (text, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertText", 0, [text, insertLocation], false, true, null));
		};
		InlinePicture.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		InlinePicture.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		InlinePicture.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["AltTextDescription"])) {
				this.m_altTextDescription=obj["AltTextDescription"];
			}
			if (!_isUndefined(obj["AltTextTitle"])) {
				this.m_altTextTitle=obj["AltTextTitle"];
			}
			if (!_isUndefined(obj["Height"])) {
				this.m_height=obj["Height"];
			}
			if (!_isUndefined(obj["Hyperlink"])) {
				this.m_hyperlink=obj["Hyperlink"];
			}
			if (!_isUndefined(obj["LockAspectRatio"])) {
				this.m_lockAspectRatio=obj["LockAspectRatio"];
			}
			if (!_isUndefined(obj["Width"])) {
				this.m_width=obj["Width"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["paragraph", "Paragraph", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentTable", "ParentTable", "parentTableCell", "ParentTableCell", "parentTableCellOrNullObject", "ParentTableCellOrNullObject", "parentTableOrNullObject", "ParentTableOrNullObject"]);
		};
		InlinePicture.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		InlinePicture.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		InlinePicture.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		InlinePicture.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		InlinePicture.prototype.toJSON=function () {
			return {
				"altTextDescription": this.m_altTextDescription,
				"altTextTitle": this.m_altTextTitle,
				"height": this.m_height,
				"hyperlink": this.m_hyperlink,
				"lockAspectRatio": this.m_lockAspectRatio,
				"width": this.m_width
			};
		};
		return InlinePicture;
	}(OfficeExtension.ClientObject));
	Word.InlinePicture=InlinePicture;
	var InlinePictureCollection=(function (_super) {
		__extends(InlinePictureCollection, _super);
		function InlinePictureCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(InlinePictureCollection.prototype, "_className", {
			get: function () {
				return "InlinePictureCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePictureCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "InlinePictureCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(InlinePictureCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "InlinePictureCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		InlinePictureCollection.prototype.getFirst=function () {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		InlinePictureCollection.prototype.getFirstOrNullObject=function () {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		InlinePictureCollection.prototype._GetItem=function (index) {
			return new Word.InlinePicture(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		InlinePictureCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		InlinePictureCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.InlinePicture(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		InlinePictureCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		InlinePictureCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		InlinePictureCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		InlinePictureCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		InlinePictureCollection.prototype.toJSON=function () {
			return {};
		};
		return InlinePictureCollection;
	}(OfficeExtension.ClientObject));
	Word.InlinePictureCollection=InlinePictureCollection;
	var List=(function (_super) {
		__extends(List, _super);
		function List() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(List.prototype, "_className", {
			get: function () {
				return "List";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(List.prototype, "paragraphs", {
			get: function () {
				if (!this.m_paragraphs) {
					this.m_paragraphs=new Word.ParagraphCollection(this.context, _createPropertyObjectPath(this.context, this, "Paragraphs", true, false));
				}
				return this.m_paragraphs;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(List.prototype, "id", {
			get: function () {
				_throwIfNotLoaded("id", this.m_id, "List", this._isNull);
				return this.m_id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(List.prototype, "levelExistences", {
			get: function () {
				_throwIfNotLoaded("levelExistences", this.m_levelExistences, "List", this._isNull);
				return this.m_levelExistences;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(List.prototype, "levelTypes", {
			get: function () {
				_throwIfNotLoaded("levelTypes", this.m_levelTypes, "List", this._isNull);
				return this.m_levelTypes;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(List.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "List", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		List.prototype.getLevelParagraphs=function (level) {
			return new Word.ParagraphCollection(this.context, _createMethodObjectPath(this.context, this, "GetLevelParagraphs", 1, [level], true, false, null));
		};
		List.prototype.getLevelString=function (level) {
			var action=_createMethodAction(this.context, this, "GetLevelString", 1, [level]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		List.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		List.prototype.setLevelAlignment=function (level, alignment) {
			_createMethodAction(this.context, this, "SetLevelAlignment", 0, [level, alignment]);
		};
		List.prototype.setLevelBullet=function (level, listBullet, charCode, fontName) {
			_createMethodAction(this.context, this, "SetLevelBullet", 0, [level, listBullet, charCode, fontName]);
		};
		List.prototype.setLevelIndents=function (level, textIndent, bulletNumberPictureIndent) {
			_createMethodAction(this.context, this, "SetLevelIndents", 0, [level, textIndent, bulletNumberPictureIndent]);
		};
		List.prototype.setLevelNumbering=function (level, listNumbering, formatString) {
			_createMethodAction(this.context, this, "SetLevelNumbering", 0, [level, listNumbering, formatString]);
		};
		List.prototype.setLevelStartingNumber=function (level, startingNumber) {
			_createMethodAction(this.context, this, "SetLevelStartingNumber", 0, [level, startingNumber]);
		};
		List.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		List.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Id"])) {
				this.m_id=obj["Id"];
			}
			if (!_isUndefined(obj["LevelExistences"])) {
				this.m_levelExistences=obj["LevelExistences"];
			}
			if (!_isUndefined(obj["LevelTypes"])) {
				this.m_levelTypes=obj["LevelTypes"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["paragraphs", "Paragraphs"]);
		};
		List.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		List.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["Id"])) {
				this.m_id=value["Id"];
			}
		};
		List.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		List.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		List.prototype.toJSON=function () {
			return {
				"id": this.m_id,
				"levelExistences": this.m_levelExistences,
				"levelTypes": this.m_levelTypes
			};
		};
		return List;
	}(OfficeExtension.ClientObject));
	Word.List=List;
	var ListCollection=(function (_super) {
		__extends(ListCollection, _super);
		function ListCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ListCollection.prototype, "_className", {
			get: function () {
				return "ListCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ListCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "ListCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		ListCollection.prototype.getById=function (id) {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "GetById", 1, [id], false, false, null));
		};
		ListCollection.prototype.getByIdOrNullObject=function (id) {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "GetByIdOrNullObject", 1, [id], false, false, null));
		};
		ListCollection.prototype.getFirst=function () {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		ListCollection.prototype.getFirstOrNullObject=function () {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		ListCollection.prototype.getItem=function (index) {
			return new Word.List(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		ListCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		ListCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.List(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ListCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ListCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		ListCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		ListCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		ListCollection.prototype.toJSON=function () {
			return {};
		};
		return ListCollection;
	}(OfficeExtension.ClientObject));
	Word.ListCollection=ListCollection;
	var ListItem=(function (_super) {
		__extends(ListItem, _super);
		function ListItem() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ListItem.prototype, "_className", {
			get: function () {
				return "ListItem";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListItem.prototype, "level", {
			get: function () {
				_throwIfNotLoaded("level", this.m_level, "ListItem", this._isNull);
				return this.m_level;
			},
			set: function (value) {
				this.m_level=value;
				_createSetPropertyAction(this.context, this, "Level", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListItem.prototype, "listString", {
			get: function () {
				_throwIfNotLoaded("listString", this.m_listString, "ListItem", this._isNull);
				return this.m_listString;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListItem.prototype, "siblingIndex", {
			get: function () {
				_throwIfNotLoaded("siblingIndex", this.m_siblingIndex, "ListItem", this._isNull);
				return this.m_siblingIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ListItem.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "ListItem", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		ListItem.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["level"], [], []);
		};
		ListItem.prototype.getAncestor=function (parentOnly) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetAncestor", 1, [parentOnly], false, false, null));
		};
		ListItem.prototype.getAncestorOrNullObject=function (parentOnly) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetAncestorOrNullObject", 1, [parentOnly], false, false, null));
		};
		ListItem.prototype.getDescendants=function (directChildrenOnly) {
			return new Word.ParagraphCollection(this.context, _createMethodObjectPath(this.context, this, "GetDescendants", 1, [directChildrenOnly], true, false, null));
		};
		ListItem.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		ListItem.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Level"])) {
				this.m_level=obj["Level"];
			}
			if (!_isUndefined(obj["ListString"])) {
				this.m_listString=obj["ListString"];
			}
			if (!_isUndefined(obj["SiblingIndex"])) {
				this.m_siblingIndex=obj["SiblingIndex"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
		};
		ListItem.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ListItem.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		ListItem.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		ListItem.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		ListItem.prototype.toJSON=function () {
			return {
				"level": this.m_level,
				"listString": this.m_listString,
				"siblingIndex": this.m_siblingIndex
			};
		};
		return ListItem;
	}(OfficeExtension.ClientObject));
	Word.ListItem=ListItem;
	var Paragraph=(function (_super) {
		__extends(Paragraph, _super);
		function Paragraph() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Paragraph.prototype, "_className", {
			get: function () {
				return "Paragraph";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "contentControls", {
			get: function () {
				if (!this.m_contentControls) {
					this.m_contentControls=new Word.ContentControlCollection(this.context, _createPropertyObjectPath(this.context, this, "ContentControls", true, false));
				}
				return this.m_contentControls;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "inlinePictures", {
			get: function () {
				if (!this.m_inlinePictures) {
					this.m_inlinePictures=new Word.InlinePictureCollection(this.context, _createPropertyObjectPath(this.context, this, "InlinePictures", true, false));
				}
				return this.m_inlinePictures;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "list", {
			get: function () {
				if (!this.m_list) {
					this.m_list=new Word.List(this.context, _createPropertyObjectPath(this.context, this, "List", false, false));
				}
				return this.m_list;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "listItem", {
			get: function () {
				if (!this.m_listItem) {
					this.m_listItem=new Word.ListItem(this.context, _createPropertyObjectPath(this.context, this, "ListItem", false, false));
				}
				return this.m_listItem;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "listItemOrNullObject", {
			get: function () {
				if (!this.m_listItemOrNullObject) {
					this.m_listItemOrNullObject=new Word.ListItem(this.context, _createPropertyObjectPath(this.context, this, "ListItemOrNullObject", false, false));
				}
				return this.m_listItemOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "listOrNullObject", {
			get: function () {
				if (!this.m_listOrNullObject) {
					this.m_listOrNullObject=new Word.List(this.context, _createPropertyObjectPath(this.context, this, "ListOrNullObject", false, false));
				}
				return this.m_listOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentBody", {
			get: function () {
				if (!this.m_parentBody) {
					this.m_parentBody=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBody", false, false));
				}
				return this.m_parentBody;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentTableCell", {
			get: function () {
				if (!this.m_parentTableCell) {
					this.m_parentTableCell=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCell", false, false));
				}
				return this.m_parentTableCell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentTableCellOrNullObject", {
			get: function () {
				if (!this.m_parentTableCellOrNullObject) {
					this.m_parentTableCellOrNullObject=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCellOrNullObject", false, false));
				}
				return this.m_parentTableCellOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "parentTableOrNullObject", {
			get: function () {
				if (!this.m_parentTableOrNullObject) {
					this.m_parentTableOrNullObject=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTableOrNullObject", false, false));
				}
				return this.m_parentTableOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "alignment", {
			get: function () {
				_throwIfNotLoaded("alignment", this.m_alignment, "Paragraph", this._isNull);
				return this.m_alignment;
			},
			set: function (value) {
				this.m_alignment=value;
				_createSetPropertyAction(this.context, this, "Alignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "firstLineIndent", {
			get: function () {
				_throwIfNotLoaded("firstLineIndent", this.m_firstLineIndent, "Paragraph", this._isNull);
				return this.m_firstLineIndent;
			},
			set: function (value) {
				this.m_firstLineIndent=value;
				_createSetPropertyAction(this.context, this, "FirstLineIndent", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "isLastParagraph", {
			get: function () {
				_throwIfNotLoaded("isLastParagraph", this.m_isLastParagraph, "Paragraph", this._isNull);
				return this.m_isLastParagraph;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "isListItem", {
			get: function () {
				_throwIfNotLoaded("isListItem", this.m_isListItem, "Paragraph", this._isNull);
				return this.m_isListItem;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "leftIndent", {
			get: function () {
				_throwIfNotLoaded("leftIndent", this.m_leftIndent, "Paragraph", this._isNull);
				return this.m_leftIndent;
			},
			set: function (value) {
				this.m_leftIndent=value;
				_createSetPropertyAction(this.context, this, "LeftIndent", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "lineSpacing", {
			get: function () {
				_throwIfNotLoaded("lineSpacing", this.m_lineSpacing, "Paragraph", this._isNull);
				return this.m_lineSpacing;
			},
			set: function (value) {
				this.m_lineSpacing=value;
				_createSetPropertyAction(this.context, this, "LineSpacing", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "lineUnitAfter", {
			get: function () {
				_throwIfNotLoaded("lineUnitAfter", this.m_lineUnitAfter, "Paragraph", this._isNull);
				return this.m_lineUnitAfter;
			},
			set: function (value) {
				this.m_lineUnitAfter=value;
				_createSetPropertyAction(this.context, this, "LineUnitAfter", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "lineUnitBefore", {
			get: function () {
				_throwIfNotLoaded("lineUnitBefore", this.m_lineUnitBefore, "Paragraph", this._isNull);
				return this.m_lineUnitBefore;
			},
			set: function (value) {
				this.m_lineUnitBefore=value;
				_createSetPropertyAction(this.context, this, "LineUnitBefore", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "outlineLevel", {
			get: function () {
				_throwIfNotLoaded("outlineLevel", this.m_outlineLevel, "Paragraph", this._isNull);
				return this.m_outlineLevel;
			},
			set: function (value) {
				this.m_outlineLevel=value;
				_createSetPropertyAction(this.context, this, "OutlineLevel", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "rightIndent", {
			get: function () {
				_throwIfNotLoaded("rightIndent", this.m_rightIndent, "Paragraph", this._isNull);
				return this.m_rightIndent;
			},
			set: function (value) {
				this.m_rightIndent=value;
				_createSetPropertyAction(this.context, this, "RightIndent", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "spaceAfter", {
			get: function () {
				_throwIfNotLoaded("spaceAfter", this.m_spaceAfter, "Paragraph", this._isNull);
				return this.m_spaceAfter;
			},
			set: function (value) {
				this.m_spaceAfter=value;
				_createSetPropertyAction(this.context, this, "SpaceAfter", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "spaceBefore", {
			get: function () {
				_throwIfNotLoaded("spaceBefore", this.m_spaceBefore, "Paragraph", this._isNull);
				return this.m_spaceBefore;
			},
			set: function (value) {
				this.m_spaceBefore=value;
				_createSetPropertyAction(this.context, this, "SpaceBefore", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "Paragraph", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "styleBuiltIn", {
			get: function () {
				_throwIfNotLoaded("styleBuiltIn", this.m_styleBuiltIn, "Paragraph", this._isNull);
				return this.m_styleBuiltIn;
			},
			set: function (value) {
				this.m_styleBuiltIn=value;
				_createSetPropertyAction(this.context, this, "StyleBuiltIn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "tableNestingLevel", {
			get: function () {
				_throwIfNotLoaded("tableNestingLevel", this.m_tableNestingLevel, "Paragraph", this._isNull);
				return this.m_tableNestingLevel;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "Paragraph", this._isNull);
				return this.m_text;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "Paragraph", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Paragraph.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Paragraph", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Paragraph.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["style", "alignment", "firstLineIndent", "leftIndent", "rightIndent", "lineSpacing", "outlineLevel", "spaceBefore", "spaceAfter", "lineUnitBefore", "lineUnitAfter", "styleBuiltIn"], ["font", "listItem", "listItemOrNullObject"], [
				"contentControls",
				"inlinePictures",
				"list",
				"listOrNullObject",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"contentControls",
				"inlinePictures",
				"list",
				"listOrNullObject",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject"
			]);
		};
		Paragraph.prototype.attachToList=function (listId, level) {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "AttachToList", 0, [listId, level], false, false, null));
		};
		Paragraph.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		Paragraph.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		Paragraph.prototype.detachFromList=function () {
			_createMethodAction(this.context, this, "DetachFromList", 0, []);
		};
		Paragraph.prototype.getHtml=function () {
			var action=_createMethodAction(this.context, this, "GetHtml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Paragraph.prototype.getNext=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		Paragraph.prototype.getNextOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		Paragraph.prototype.getOoxml=function () {
			var action=_createMethodAction(this.context, this, "GetOoxml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Paragraph.prototype.getPrevious=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetPrevious", 1, [], false, false, null));
		};
		Paragraph.prototype.getPreviousOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetPreviousOrNullObject", 1, [], false, false, null));
		};
		Paragraph.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		Paragraph.prototype.getTextRanges=function (endingMarks, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "GetTextRanges", 1, [endingMarks, trimSpacing], true, false, null));
		};
		Paragraph.prototype.insertBreak=function (breakType, insertLocation) {
			_createMethodAction(this.context, this, "InsertBreak", 0, [breakType, insertLocation]);
		};
		Paragraph.prototype.insertContentControl=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "InsertContentControl", 0, [], false, true, null));
		};
		Paragraph.prototype.insertFileFromBase64=function (base64File, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertFileFromBase64", 0, [base64File, insertLocation], false, true, null));
		};
		Paragraph.prototype.insertHtml=function (html, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertHtml", 0, [html, insertLocation], false, true, null));
		};
		Paragraph.prototype.insertInlinePictureFromBase64=function (base64EncodedImage, insertLocation) {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "InsertInlinePictureFromBase64", 0, [base64EncodedImage, insertLocation], false, true, null));
		};
		Paragraph.prototype.insertOoxml=function (ooxml, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertOoxml", 0, [ooxml, insertLocation], false, true, null));
		};
		Paragraph.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		Paragraph.prototype.insertTable=function (rowCount, columnCount, insertLocation, values) {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "InsertTable", 0, [rowCount, columnCount, insertLocation, values], false, true, null));
		};
		Paragraph.prototype.insertText=function (text, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertText", 0, [text, insertLocation], false, true, null));
		};
		Paragraph.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		Paragraph.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		Paragraph.prototype.split=function (delimiters, trimDelimiters, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Split", 1, [delimiters, trimDelimiters, trimSpacing], true, false, null));
		};
		Paragraph.prototype.startNewList=function () {
			return new Word.List(this.context, _createMethodObjectPath(this.context, this, "StartNewList", 0, [], false, false, null));
		};
		Paragraph.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Paragraph.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Alignment"])) {
				this.m_alignment=obj["Alignment"];
			}
			if (!_isUndefined(obj["FirstLineIndent"])) {
				this.m_firstLineIndent=obj["FirstLineIndent"];
			}
			if (!_isUndefined(obj["IsLastParagraph"])) {
				this.m_isLastParagraph=obj["IsLastParagraph"];
			}
			if (!_isUndefined(obj["IsListItem"])) {
				this.m_isListItem=obj["IsListItem"];
			}
			if (!_isUndefined(obj["LeftIndent"])) {
				this.m_leftIndent=obj["LeftIndent"];
			}
			if (!_isUndefined(obj["LineSpacing"])) {
				this.m_lineSpacing=obj["LineSpacing"];
			}
			if (!_isUndefined(obj["LineUnitAfter"])) {
				this.m_lineUnitAfter=obj["LineUnitAfter"];
			}
			if (!_isUndefined(obj["LineUnitBefore"])) {
				this.m_lineUnitBefore=obj["LineUnitBefore"];
			}
			if (!_isUndefined(obj["OutlineLevel"])) {
				this.m_outlineLevel=obj["OutlineLevel"];
			}
			if (!_isUndefined(obj["RightIndent"])) {
				this.m_rightIndent=obj["RightIndent"];
			}
			if (!_isUndefined(obj["SpaceAfter"])) {
				this.m_spaceAfter=obj["SpaceAfter"];
			}
			if (!_isUndefined(obj["SpaceBefore"])) {
				this.m_spaceBefore=obj["SpaceBefore"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["StyleBuiltIn"])) {
				this.m_styleBuiltIn=obj["StyleBuiltIn"];
			}
			if (!_isUndefined(obj["TableNestingLevel"])) {
				this.m_tableNestingLevel=obj["TableNestingLevel"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["contentControls", "ContentControls", "font", "Font", "inlinePictures", "InlinePictures", "list", "List", "listItem", "ListItem", "listItemOrNullObject", "ListItemOrNullObject", "listOrNullObject", "ListOrNullObject", "parentBody", "ParentBody", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentTable", "ParentTable", "parentTableCell", "ParentTableCell", "parentTableCellOrNullObject", "ParentTableCellOrNullObject", "parentTableOrNullObject", "ParentTableOrNullObject"]);
		};
		Paragraph.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Paragraph.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		Paragraph.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Paragraph.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Paragraph.prototype.toJSON=function () {
			return {
				"alignment": this.m_alignment,
				"firstLineIndent": this.m_firstLineIndent,
				"font": this.m_font,
				"isLastParagraph": this.m_isLastParagraph,
				"isListItem": this.m_isListItem,
				"leftIndent": this.m_leftIndent,
				"lineSpacing": this.m_lineSpacing,
				"lineUnitAfter": this.m_lineUnitAfter,
				"lineUnitBefore": this.m_lineUnitBefore,
				"listItem": this.m_listItem,
				"listItemOrNullObject": this.m_listItemOrNullObject,
				"outlineLevel": this.m_outlineLevel,
				"rightIndent": this.m_rightIndent,
				"spaceAfter": this.m_spaceAfter,
				"spaceBefore": this.m_spaceBefore,
				"style": this.m_style,
				"styleBuiltIn": this.m_styleBuiltIn,
				"tableNestingLevel": this.m_tableNestingLevel,
				"text": this.m_text
			};
		};
		return Paragraph;
	}(OfficeExtension.ClientObject));
	Word.Paragraph=Paragraph;
	var ParagraphCollection=(function (_super) {
		__extends(ParagraphCollection, _super);
		function ParagraphCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ParagraphCollection.prototype, "_className", {
			get: function () {
				return "ParagraphCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ParagraphCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "ParagraphCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ParagraphCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "ParagraphCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		ParagraphCollection.prototype.getFirst=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		ParagraphCollection.prototype.getFirstOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		ParagraphCollection.prototype.getLast=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetLast", 1, [], false, false, null));
		};
		ParagraphCollection.prototype.getLastOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetLastOrNullObject", 1, [], false, false, null));
		};
		ParagraphCollection.prototype._GetItem=function (index) {
			return new Word.Paragraph(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		ParagraphCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		ParagraphCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.Paragraph(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		ParagraphCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		ParagraphCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		ParagraphCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		ParagraphCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		ParagraphCollection.prototype.toJSON=function () {
			return {};
		};
		return ParagraphCollection;
	}(OfficeExtension.ClientObject));
	Word.ParagraphCollection=ParagraphCollection;
	var Range=(function (_super) {
		__extends(Range, _super);
		function Range() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Range.prototype, "_className", {
			get: function () {
				return "Range";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "contentControls", {
			get: function () {
				if (!this.m_contentControls) {
					this.m_contentControls=new Word.ContentControlCollection(this.context, _createPropertyObjectPath(this.context, this, "ContentControls", true, false));
				}
				return this.m_contentControls;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "inlinePictures", {
			get: function () {
				if (!this.m_inlinePictures) {
					this.m_inlinePictures=new Word.InlinePictureCollection(this.context, _createPropertyObjectPath(this.context, this, "InlinePictures", true, false));
				}
				return this.m_inlinePictures;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "lists", {
			get: function () {
				if (!this.m_lists) {
					this.m_lists=new Word.ListCollection(this.context, _createPropertyObjectPath(this.context, this, "Lists", true, false));
				}
				return this.m_lists;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "paragraphs", {
			get: function () {
				if (!this.m_paragraphs) {
					this.m_paragraphs=new Word.ParagraphCollection(this.context, _createPropertyObjectPath(this.context, this, "Paragraphs", true, false));
				}
				return this.m_paragraphs;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentBody", {
			get: function () {
				if (!this.m_parentBody) {
					this.m_parentBody=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBody", false, false));
				}
				return this.m_parentBody;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentTableCell", {
			get: function () {
				if (!this.m_parentTableCell) {
					this.m_parentTableCell=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCell", false, false));
				}
				return this.m_parentTableCell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentTableCellOrNullObject", {
			get: function () {
				if (!this.m_parentTableCellOrNullObject) {
					this.m_parentTableCellOrNullObject=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCellOrNullObject", false, false));
				}
				return this.m_parentTableCellOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "parentTableOrNullObject", {
			get: function () {
				if (!this.m_parentTableOrNullObject) {
					this.m_parentTableOrNullObject=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTableOrNullObject", false, false));
				}
				return this.m_parentTableOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Word.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "hyperlink", {
			get: function () {
				_throwIfNotLoaded("hyperlink", this.m_hyperlink, "Range", this._isNull);
				return this.m_hyperlink;
			},
			set: function (value) {
				this.m_hyperlink=value;
				_createSetPropertyAction(this.context, this, "Hyperlink", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "isEmpty", {
			get: function () {
				_throwIfNotLoaded("isEmpty", this.m_isEmpty, "Range", this._isNull);
				return this.m_isEmpty;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "Range", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "styleBuiltIn", {
			get: function () {
				_throwIfNotLoaded("styleBuiltIn", this.m_styleBuiltIn, "Range", this._isNull);
				return this.m_styleBuiltIn;
			},
			set: function (value) {
				this.m_styleBuiltIn=value;
				_createSetPropertyAction(this.context, this, "StyleBuiltIn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "text", {
			get: function () {
				_throwIfNotLoaded("text", this.m_text, "Range", this._isNull);
				return this.m_text;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "Range", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Range", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Range.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["style", "hyperlink", "styleBuiltIn"], ["font"], [
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"tables",
				"contentControls",
				"inlinePictures",
				"lists",
				"paragraphs",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"tables"
			]);
		};
		Range.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		Range.prototype.compareLocationWith=function (range) {
			var action=_createMethodAction(this.context, this, "CompareLocationWith", 1, [range]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Range.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		Range.prototype.expandTo=function (range) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "ExpandTo", 0, [range], false, false, null));
		};
		Range.prototype.expandToOrNullObject=function (range) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "ExpandToOrNullObject", 0, [range], false, false, null));
		};
		Range.prototype.getHtml=function () {
			var action=_createMethodAction(this.context, this, "GetHtml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Range.prototype.getHyperlinkRanges=function () {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "GetHyperlinkRanges", 1, [], true, false, null));
		};
		Range.prototype.getNextTextRange=function (endingMarks, trimSpacing) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetNextTextRange", 1, [endingMarks, trimSpacing], false, false, null));
		};
		Range.prototype.getNextTextRangeOrNullObject=function (endingMarks, trimSpacing) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetNextTextRangeOrNullObject", 1, [endingMarks, trimSpacing], false, false, null));
		};
		Range.prototype.getOoxml=function () {
			var action=_createMethodAction(this.context, this, "GetOoxml", 1, []);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Range.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		Range.prototype.getTextRanges=function (endingMarks, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "GetTextRanges", 1, [endingMarks, trimSpacing], true, false, null));
		};
		Range.prototype.insertBreak=function (breakType, insertLocation) {
			_createMethodAction(this.context, this, "InsertBreak", 0, [breakType, insertLocation]);
		};
		Range.prototype.insertContentControl=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "InsertContentControl", 0, [], false, true, null));
		};
		Range.prototype.insertFileFromBase64=function (base64File, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertFileFromBase64", 0, [base64File, insertLocation], false, true, null));
		};
		Range.prototype.insertHtml=function (html, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertHtml", 0, [html, insertLocation], false, true, null));
		};
		Range.prototype.insertInlinePictureFromBase64=function (base64EncodedImage, insertLocation) {
			return new Word.InlinePicture(this.context, _createMethodObjectPath(this.context, this, "InsertInlinePictureFromBase64", 0, [base64EncodedImage, insertLocation], false, true, null));
		};
		Range.prototype.insertOoxml=function (ooxml, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertOoxml", 0, [ooxml, insertLocation], false, true, null));
		};
		Range.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		Range.prototype.insertTable=function (rowCount, columnCount, insertLocation, values) {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "InsertTable", 0, [rowCount, columnCount, insertLocation, values], false, true, null));
		};
		Range.prototype.insertText=function (text, insertLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "InsertText", 0, [text, insertLocation], false, true, null));
		};
		Range.prototype.intersectWith=function (range) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "IntersectWith", 0, [range], false, false, null));
		};
		Range.prototype.intersectWithOrNullObject=function (range) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "IntersectWithOrNullObject", 0, [range], false, false, null));
		};
		Range.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		Range.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		Range.prototype.split=function (delimiters, multiParagraphs, trimDelimiters, trimSpacing) {
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Split", 1, [delimiters, multiParagraphs, trimDelimiters, trimSpacing], true, false, null));
		};
		Range.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Range.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Hyperlink"])) {
				this.m_hyperlink=obj["Hyperlink"];
			}
			if (!_isUndefined(obj["IsEmpty"])) {
				this.m_isEmpty=obj["IsEmpty"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["StyleBuiltIn"])) {
				this.m_styleBuiltIn=obj["StyleBuiltIn"];
			}
			if (!_isUndefined(obj["Text"])) {
				this.m_text=obj["Text"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["contentControls", "ContentControls", "font", "Font", "inlinePictures", "InlinePictures", "lists", "Lists", "paragraphs", "Paragraphs", "parentBody", "ParentBody", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentTable", "ParentTable", "parentTableCell", "ParentTableCell", "parentTableCellOrNullObject", "ParentTableCellOrNullObject", "parentTableOrNullObject", "ParentTableOrNullObject", "tables", "Tables"]);
		};
		Range.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Range.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		Range.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Range.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Range.prototype.toJSON=function () {
			return {
				"font": this.m_font,
				"hyperlink": this.m_hyperlink,
				"isEmpty": this.m_isEmpty,
				"style": this.m_style,
				"styleBuiltIn": this.m_styleBuiltIn,
				"text": this.m_text
			};
		};
		return Range;
	}(OfficeExtension.ClientObject));
	Word.Range=Range;
	var RangeCollection=(function (_super) {
		__extends(RangeCollection, _super);
		function RangeCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(RangeCollection.prototype, "_className", {
			get: function () {
				return "RangeCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "RangeCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(RangeCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "RangeCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		RangeCollection.prototype.getFirst=function () {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		RangeCollection.prototype.getFirstOrNullObject=function () {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		RangeCollection.prototype._GetItem=function (index) {
			return new Word.Range(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		RangeCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		RangeCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.Range(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		RangeCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		RangeCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		RangeCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		RangeCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		RangeCollection.prototype.toJSON=function () {
			return {};
		};
		return RangeCollection;
	}(OfficeExtension.ClientObject));
	Word.RangeCollection=RangeCollection;
	var SearchOptions=(function (_super) {
		__extends(SearchOptions, _super);
		function SearchOptions() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(SearchOptions.prototype, "_className", {
			get: function () {
				return "SearchOptions";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchWildCards", {
			get: function () {
				_throwIfNotLoaded("matchWildCards", this.m_matchWildcards);
				return this.m_matchWildcards;
			},
			set: function (value) {
				this.m_matchWildcards=value;
				_createSetPropertyAction(this.context, this, "MatchWildCards", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "ignorePunct", {
			get: function () {
				_throwIfNotLoaded("ignorePunct", this.m_ignorePunct, "SearchOptions", this._isNull);
				return this.m_ignorePunct;
			},
			set: function (value) {
				this.m_ignorePunct=value;
				_createSetPropertyAction(this.context, this, "IgnorePunct", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "ignoreSpace", {
			get: function () {
				_throwIfNotLoaded("ignoreSpace", this.m_ignoreSpace, "SearchOptions", this._isNull);
				return this.m_ignoreSpace;
			},
			set: function (value) {
				this.m_ignoreSpace=value;
				_createSetPropertyAction(this.context, this, "IgnoreSpace", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchCase", {
			get: function () {
				_throwIfNotLoaded("matchCase", this.m_matchCase, "SearchOptions", this._isNull);
				return this.m_matchCase;
			},
			set: function (value) {
				this.m_matchCase=value;
				_createSetPropertyAction(this.context, this, "MatchCase", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchPrefix", {
			get: function () {
				_throwIfNotLoaded("matchPrefix", this.m_matchPrefix, "SearchOptions", this._isNull);
				return this.m_matchPrefix;
			},
			set: function (value) {
				this.m_matchPrefix=value;
				_createSetPropertyAction(this.context, this, "MatchPrefix", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchSuffix", {
			get: function () {
				_throwIfNotLoaded("matchSuffix", this.m_matchSuffix, "SearchOptions", this._isNull);
				return this.m_matchSuffix;
			},
			set: function (value) {
				this.m_matchSuffix=value;
				_createSetPropertyAction(this.context, this, "MatchSuffix", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchWholeWord", {
			get: function () {
				_throwIfNotLoaded("matchWholeWord", this.m_matchWholeWord, "SearchOptions", this._isNull);
				return this.m_matchWholeWord;
			},
			set: function (value) {
				this.m_matchWholeWord=value;
				_createSetPropertyAction(this.context, this, "MatchWholeWord", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SearchOptions.prototype, "matchWildcards", {
			get: function () {
				_throwIfNotLoaded("matchWildcards", this.m_matchWildcards, "SearchOptions", this._isNull);
				return this.m_matchWildcards;
			},
			set: function (value) {
				this.m_matchWildcards=value;
				_createSetPropertyAction(this.context, this, "MatchWildcards", value);
			},
			enumerable: true,
			configurable: true
		});
		SearchOptions.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["ignorePunct", "ignoreSpace", "matchCase", "matchPrefix", "matchSuffix", "matchWildcards", "matchWholeWord"], [], []);
		};
		SearchOptions.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["IgnorePunct"])) {
				this.m_ignorePunct=obj["IgnorePunct"];
			}
			if (!_isUndefined(obj["IgnoreSpace"])) {
				this.m_ignoreSpace=obj["IgnoreSpace"];
			}
			if (!_isUndefined(obj["MatchCase"])) {
				this.m_matchCase=obj["MatchCase"];
			}
			if (!_isUndefined(obj["MatchPrefix"])) {
				this.m_matchPrefix=obj["MatchPrefix"];
			}
			if (!_isUndefined(obj["MatchSuffix"])) {
				this.m_matchSuffix=obj["MatchSuffix"];
			}
			if (!_isUndefined(obj["MatchWholeWord"])) {
				this.m_matchWholeWord=obj["MatchWholeWord"];
			}
			if (!_isUndefined(obj["MatchWildcards"])) {
				this.m_matchWildcards=obj["MatchWildcards"];
			}
		};
		SearchOptions.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		SearchOptions.newObject=function (context) {
			var ret=new Word.SearchOptions(context, _createNewObjectObjectPath(context, "Microsoft.WordServices.SearchOptions", false));
			return ret;
		};
		SearchOptions.prototype.toJSON=function () {
			return {
				"ignorePunct": this.m_ignorePunct,
				"ignoreSpace": this.m_ignoreSpace,
				"matchCase": this.m_matchCase,
				"matchPrefix": this.m_matchPrefix,
				"matchSuffix": this.m_matchSuffix,
				"matchWholeWord": this.m_matchWholeWord,
				"matchWildcards": this.m_matchWildcards
			};
		};
		return SearchOptions;
	}(OfficeExtension.ClientObject));
	Word.SearchOptions=SearchOptions;
	var Section=(function (_super) {
		__extends(Section, _super);
		function Section() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Section.prototype, "_className", {
			get: function () {
				return "Section";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Section.prototype, "body", {
			get: function () {
				if (!this.m_body) {
					this.m_body=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "Body", false, false));
				}
				return this.m_body;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Section.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "Section", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Section.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Section", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Section.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, [], ["body"], []);
		};
		Section.prototype.getFooter=function (type) {
			return new Word.Body(this.context, _createMethodObjectPath(this.context, this, "GetFooter", 1, [type], false, true, null));
		};
		Section.prototype.getHeader=function (type) {
			return new Word.Body(this.context, _createMethodObjectPath(this.context, this, "GetHeader", 1, [type], false, true, null));
		};
		Section.prototype.getNext=function () {
			return new Word.Section(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		Section.prototype.getNextOrNullObject=function () {
			return new Word.Section(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		Section.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Section.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["body", "Body"]);
		};
		Section.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Section.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		Section.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Section.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Section.prototype.toJSON=function () {
			return {
				"body": this.m_body
			};
		};
		return Section;
	}(OfficeExtension.ClientObject));
	Word.Section=Section;
	var SectionCollection=(function (_super) {
		__extends(SectionCollection, _super);
		function SectionCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(SectionCollection.prototype, "_className", {
			get: function () {
				return "SectionCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SectionCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "SectionCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SectionCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "SectionCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		SectionCollection.prototype.getFirst=function () {
			return new Word.Section(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		SectionCollection.prototype.getFirstOrNullObject=function () {
			return new Word.Section(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		SectionCollection.prototype._GetItem=function (index) {
			return new Word.Section(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		SectionCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		SectionCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.Section(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		SectionCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		SectionCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		SectionCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		SectionCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		SectionCollection.prototype.toJSON=function () {
			return {};
		};
		return SectionCollection;
	}(OfficeExtension.ClientObject));
	Word.SectionCollection=SectionCollection;
	var Table=(function (_super) {
		__extends(Table, _super);
		function Table() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(Table.prototype, "_className", {
			get: function () {
				return "Table";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentBody", {
			get: function () {
				if (!this.m_parentBody) {
					this.m_parentBody=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "ParentBody", false, false));
				}
				return this.m_parentBody;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentContentControl", {
			get: function () {
				if (!this.m_parentContentControl) {
					this.m_parentContentControl=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControl", false, false));
				}
				return this.m_parentContentControl;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentContentControlOrNullObject", {
			get: function () {
				if (!this.m_parentContentControlOrNullObject) {
					this.m_parentContentControlOrNullObject=new Word.ContentControl(this.context, _createPropertyObjectPath(this.context, this, "ParentContentControlOrNullObject", false, false));
				}
				return this.m_parentContentControlOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentTableCell", {
			get: function () {
				if (!this.m_parentTableCell) {
					this.m_parentTableCell=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCell", false, false));
				}
				return this.m_parentTableCell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentTableCellOrNullObject", {
			get: function () {
				if (!this.m_parentTableCellOrNullObject) {
					this.m_parentTableCellOrNullObject=new Word.TableCell(this.context, _createPropertyObjectPath(this.context, this, "ParentTableCellOrNullObject", false, false));
				}
				return this.m_parentTableCellOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "parentTableOrNullObject", {
			get: function () {
				if (!this.m_parentTableOrNullObject) {
					this.m_parentTableOrNullObject=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTableOrNullObject", false, false));
				}
				return this.m_parentTableOrNullObject;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "rows", {
			get: function () {
				if (!this.m_rows) {
					this.m_rows=new Word.TableRowCollection(this.context, _createPropertyObjectPath(this.context, this, "Rows", true, false));
				}
				return this.m_rows;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "tables", {
			get: function () {
				if (!this.m_tables) {
					this.m_tables=new Word.TableCollection(this.context, _createPropertyObjectPath(this.context, this, "Tables", true, false));
				}
				return this.m_tables;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "alignment", {
			get: function () {
				_throwIfNotLoaded("alignment", this.m_alignment, "Table", this._isNull);
				return this.m_alignment;
			},
			set: function (value) {
				this.m_alignment=value;
				_createSetPropertyAction(this.context, this, "Alignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "headerRowCount", {
			get: function () {
				_throwIfNotLoaded("headerRowCount", this.m_headerRowCount, "Table", this._isNull);
				return this.m_headerRowCount;
			},
			set: function (value) {
				this.m_headerRowCount=value;
				_createSetPropertyAction(this.context, this, "HeaderRowCount", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "horizontalAlignment", {
			get: function () {
				_throwIfNotLoaded("horizontalAlignment", this.m_horizontalAlignment, "Table", this._isNull);
				return this.m_horizontalAlignment;
			},
			set: function (value) {
				this.m_horizontalAlignment=value;
				_createSetPropertyAction(this.context, this, "HorizontalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "isUniform", {
			get: function () {
				_throwIfNotLoaded("isUniform", this.m_isUniform, "Table", this._isNull);
				return this.m_isUniform;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "nestingLevel", {
			get: function () {
				_throwIfNotLoaded("nestingLevel", this.m_nestingLevel, "Table", this._isNull);
				return this.m_nestingLevel;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "rowCount", {
			get: function () {
				_throwIfNotLoaded("rowCount", this.m_rowCount, "Table", this._isNull);
				return this.m_rowCount;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "shadingColor", {
			get: function () {
				_throwIfNotLoaded("shadingColor", this.m_shadingColor, "Table", this._isNull);
				return this.m_shadingColor;
			},
			set: function (value) {
				this.m_shadingColor=value;
				_createSetPropertyAction(this.context, this, "ShadingColor", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "style", {
			get: function () {
				_throwIfNotLoaded("style", this.m_style, "Table", this._isNull);
				return this.m_style;
			},
			set: function (value) {
				this.m_style=value;
				_createSetPropertyAction(this.context, this, "Style", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleBandedColumns", {
			get: function () {
				_throwIfNotLoaded("styleBandedColumns", this.m_styleBandedColumns, "Table", this._isNull);
				return this.m_styleBandedColumns;
			},
			set: function (value) {
				this.m_styleBandedColumns=value;
				_createSetPropertyAction(this.context, this, "StyleBandedColumns", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleBandedRows", {
			get: function () {
				_throwIfNotLoaded("styleBandedRows", this.m_styleBandedRows, "Table", this._isNull);
				return this.m_styleBandedRows;
			},
			set: function (value) {
				this.m_styleBandedRows=value;
				_createSetPropertyAction(this.context, this, "StyleBandedRows", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleBuiltIn", {
			get: function () {
				_throwIfNotLoaded("styleBuiltIn", this.m_styleBuiltIn, "Table", this._isNull);
				return this.m_styleBuiltIn;
			},
			set: function (value) {
				this.m_styleBuiltIn=value;
				_createSetPropertyAction(this.context, this, "StyleBuiltIn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleFirstColumn", {
			get: function () {
				_throwIfNotLoaded("styleFirstColumn", this.m_styleFirstColumn, "Table", this._isNull);
				return this.m_styleFirstColumn;
			},
			set: function (value) {
				this.m_styleFirstColumn=value;
				_createSetPropertyAction(this.context, this, "StyleFirstColumn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleLastColumn", {
			get: function () {
				_throwIfNotLoaded("styleLastColumn", this.m_styleLastColumn, "Table", this._isNull);
				return this.m_styleLastColumn;
			},
			set: function (value) {
				this.m_styleLastColumn=value;
				_createSetPropertyAction(this.context, this, "StyleLastColumn", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "styleTotalRow", {
			get: function () {
				_throwIfNotLoaded("styleTotalRow", this.m_styleTotalRow, "Table", this._isNull);
				return this.m_styleTotalRow;
			},
			set: function (value) {
				this.m_styleTotalRow=value;
				_createSetPropertyAction(this.context, this, "StyleTotalRow", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "values", {
			get: function () {
				_throwIfNotLoaded("values", this.m_values, "Table", this._isNull);
				return this.m_values;
			},
			set: function (value) {
				this.m_values=value;
				_createSetPropertyAction(this.context, this, "Values", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "verticalAlignment", {
			get: function () {
				_throwIfNotLoaded("verticalAlignment", this.m_verticalAlignment, "Table", this._isNull);
				return this.m_verticalAlignment;
			},
			set: function (value) {
				this.m_verticalAlignment=value;
				_createSetPropertyAction(this.context, this, "VerticalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "width", {
			get: function () {
				_throwIfNotLoaded("width", this.m_width, "Table", this._isNull);
				return this.m_width;
			},
			set: function (value) {
				this.m_width=value;
				_createSetPropertyAction(this.context, this, "Width", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "Table", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Table.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "Table", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		Table.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["values", "style", "headerRowCount", "styleTotalRow", "styleFirstColumn", "styleLastColumn", "styleBandedRows", "styleBandedColumns", "shadingColor", "horizontalAlignment", "verticalAlignment", "width", "styleBuiltIn", "alignment"], ["font"], [
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"rows",
				"tables",
				"parentBody",
				"parentContentControl",
				"parentContentControlOrNullObject",
				"parentTable",
				"parentTableCell",
				"parentTableCellOrNullObject",
				"parentTableOrNullObject",
				"rows",
				"tables"
			]);
		};
		Table.prototype.addColumns=function (insertLocation, columnCount, values) {
			_createMethodAction(this.context, this, "AddColumns", 0, [insertLocation, columnCount, values]);
		};
		Table.prototype.addRows=function (insertLocation, rowCount, values) {
			return new Word.TableRowCollection(this.context, _createMethodObjectPath(this.context, this, "AddRows", 0, [insertLocation, rowCount, values], true, false, null));
		};
		Table.prototype.autoFitWindow=function () {
			_createMethodAction(this.context, this, "AutoFitWindow", 0, []);
		};
		Table.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		Table.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		Table.prototype.deleteColumns=function (columnIndex, columnCount) {
			_createMethodAction(this.context, this, "DeleteColumns", 0, [columnIndex, columnCount]);
		};
		Table.prototype.deleteRows=function (rowIndex, rowCount) {
			_createMethodAction(this.context, this, "DeleteRows", 0, [rowIndex, rowCount]);
		};
		Table.prototype.distributeColumns=function () {
			_createMethodAction(this.context, this, "DistributeColumns", 0, []);
		};
		Table.prototype.getBorder=function (borderLocation) {
			return new Word.TableBorder(this.context, _createMethodObjectPath(this.context, this, "GetBorder", 1, [borderLocation], false, false, null));
		};
		Table.prototype.getCell=function (rowIndex, cellIndex) {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetCell", 1, [rowIndex, cellIndex], false, false, null));
		};
		Table.prototype.getCellOrNullObject=function (rowIndex, cellIndex) {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetCellOrNullObject", 1, [rowIndex, cellIndex], false, false, null));
		};
		Table.prototype.getCellPadding=function (cellPaddingLocation) {
			var action=_createMethodAction(this.context, this, "GetCellPadding", 1, [cellPaddingLocation]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		Table.prototype.getNext=function () {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		Table.prototype.getNextOrNullObject=function () {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		Table.prototype.getParagraphAfter=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetParagraphAfter", 1, [], false, false, null));
		};
		Table.prototype.getParagraphAfterOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetParagraphAfterOrNullObject", 1, [], false, false, null));
		};
		Table.prototype.getParagraphBefore=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetParagraphBefore", 1, [], false, false, null));
		};
		Table.prototype.getParagraphBeforeOrNullObject=function () {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "GetParagraphBeforeOrNullObject", 1, [], false, false, null));
		};
		Table.prototype.getRange=function (rangeLocation) {
			return new Word.Range(this.context, _createMethodObjectPath(this.context, this, "GetRange", 1, [rangeLocation], false, false, null));
		};
		Table.prototype.insertContentControl=function () {
			return new Word.ContentControl(this.context, _createMethodObjectPath(this.context, this, "InsertContentControl", 0, [], false, true, null));
		};
		Table.prototype.insertParagraph=function (paragraphText, insertLocation) {
			return new Word.Paragraph(this.context, _createMethodObjectPath(this.context, this, "InsertParagraph", 0, [paragraphText, insertLocation], false, true, null));
		};
		Table.prototype.insertTable=function (rowCount, columnCount, insertLocation, values) {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "InsertTable", 0, [rowCount, columnCount, insertLocation, values], false, true, null));
		};
		Table.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		Table.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		Table.prototype.setCellPadding=function (cellPaddingLocation, cellPadding) {
			_createMethodAction(this.context, this, "SetCellPadding", 0, [cellPaddingLocation, cellPadding]);
		};
		Table.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		Table.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Alignment"])) {
				this.m_alignment=obj["Alignment"];
			}
			if (!_isUndefined(obj["HeaderRowCount"])) {
				this.m_headerRowCount=obj["HeaderRowCount"];
			}
			if (!_isUndefined(obj["HorizontalAlignment"])) {
				this.m_horizontalAlignment=obj["HorizontalAlignment"];
			}
			if (!_isUndefined(obj["IsUniform"])) {
				this.m_isUniform=obj["IsUniform"];
			}
			if (!_isUndefined(obj["NestingLevel"])) {
				this.m_nestingLevel=obj["NestingLevel"];
			}
			if (!_isUndefined(obj["RowCount"])) {
				this.m_rowCount=obj["RowCount"];
			}
			if (!_isUndefined(obj["ShadingColor"])) {
				this.m_shadingColor=obj["ShadingColor"];
			}
			if (!_isUndefined(obj["Style"])) {
				this.m_style=obj["Style"];
			}
			if (!_isUndefined(obj["StyleBandedColumns"])) {
				this.m_styleBandedColumns=obj["StyleBandedColumns"];
			}
			if (!_isUndefined(obj["StyleBandedRows"])) {
				this.m_styleBandedRows=obj["StyleBandedRows"];
			}
			if (!_isUndefined(obj["StyleBuiltIn"])) {
				this.m_styleBuiltIn=obj["StyleBuiltIn"];
			}
			if (!_isUndefined(obj["StyleFirstColumn"])) {
				this.m_styleFirstColumn=obj["StyleFirstColumn"];
			}
			if (!_isUndefined(obj["StyleLastColumn"])) {
				this.m_styleLastColumn=obj["StyleLastColumn"];
			}
			if (!_isUndefined(obj["StyleTotalRow"])) {
				this.m_styleTotalRow=obj["StyleTotalRow"];
			}
			if (!_isUndefined(obj["Values"])) {
				this.m_values=obj["Values"];
			}
			if (!_isUndefined(obj["VerticalAlignment"])) {
				this.m_verticalAlignment=obj["VerticalAlignment"];
			}
			if (!_isUndefined(obj["Width"])) {
				this.m_width=obj["Width"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["font", "Font", "parentBody", "ParentBody", "parentContentControl", "ParentContentControl", "parentContentControlOrNullObject", "ParentContentControlOrNullObject", "parentTable", "ParentTable", "parentTableCell", "ParentTableCell", "parentTableCellOrNullObject", "ParentTableCellOrNullObject", "parentTableOrNullObject", "ParentTableOrNullObject", "rows", "Rows", "tables", "Tables"]);
		};
		Table.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		Table.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		Table.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		Table.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		Table.prototype.toJSON=function () {
			return {
				"alignment": this.m_alignment,
				"font": this.m_font,
				"headerRowCount": this.m_headerRowCount,
				"horizontalAlignment": this.m_horizontalAlignment,
				"isUniform": this.m_isUniform,
				"nestingLevel": this.m_nestingLevel,
				"rowCount": this.m_rowCount,
				"shadingColor": this.m_shadingColor,
				"style": this.m_style,
				"styleBandedColumns": this.m_styleBandedColumns,
				"styleBandedRows": this.m_styleBandedRows,
				"styleBuiltIn": this.m_styleBuiltIn,
				"styleFirstColumn": this.m_styleFirstColumn,
				"styleLastColumn": this.m_styleLastColumn,
				"styleTotalRow": this.m_styleTotalRow,
				"values": this.m_values,
				"verticalAlignment": this.m_verticalAlignment,
				"width": this.m_width
			};
		};
		return Table;
	}(OfficeExtension.ClientObject));
	Word.Table=Table;
	var TableCollection=(function (_super) {
		__extends(TableCollection, _super);
		function TableCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableCollection.prototype, "_className", {
			get: function () {
				return "TableCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableCollection.prototype.getFirst=function () {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		TableCollection.prototype.getFirstOrNullObject=function () {
			return new Word.Table(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		TableCollection.prototype._GetItem=function (index) {
			return new Word.Table(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		TableCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.Table(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		TableCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableCollection.prototype.toJSON=function () {
			return {};
		};
		return TableCollection;
	}(OfficeExtension.ClientObject));
	Word.TableCollection=TableCollection;
	var TableRow=(function (_super) {
		__extends(TableRow, _super);
		function TableRow() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableRow.prototype, "_className", {
			get: function () {
				return "TableRow";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "cells", {
			get: function () {
				if (!this.m_cells) {
					this.m_cells=new Word.TableCellCollection(this.context, _createPropertyObjectPath(this.context, this, "Cells", true, false));
				}
				return this.m_cells;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "font", {
			get: function () {
				if (!this.m_font) {
					this.m_font=new Word.Font(this.context, _createPropertyObjectPath(this.context, this, "Font", false, false));
				}
				return this.m_font;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "cellCount", {
			get: function () {
				_throwIfNotLoaded("cellCount", this.m_cellCount, "TableRow", this._isNull);
				return this.m_cellCount;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "horizontalAlignment", {
			get: function () {
				_throwIfNotLoaded("horizontalAlignment", this.m_horizontalAlignment, "TableRow", this._isNull);
				return this.m_horizontalAlignment;
			},
			set: function (value) {
				this.m_horizontalAlignment=value;
				_createSetPropertyAction(this.context, this, "HorizontalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "isHeader", {
			get: function () {
				_throwIfNotLoaded("isHeader", this.m_isHeader, "TableRow", this._isNull);
				return this.m_isHeader;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "preferredHeight", {
			get: function () {
				_throwIfNotLoaded("preferredHeight", this.m_preferredHeight, "TableRow", this._isNull);
				return this.m_preferredHeight;
			},
			set: function (value) {
				this.m_preferredHeight=value;
				_createSetPropertyAction(this.context, this, "PreferredHeight", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "rowIndex", {
			get: function () {
				_throwIfNotLoaded("rowIndex", this.m_rowIndex, "TableRow", this._isNull);
				return this.m_rowIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "shadingColor", {
			get: function () {
				_throwIfNotLoaded("shadingColor", this.m_shadingColor, "TableRow", this._isNull);
				return this.m_shadingColor;
			},
			set: function (value) {
				this.m_shadingColor=value;
				_createSetPropertyAction(this.context, this, "ShadingColor", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "values", {
			get: function () {
				_throwIfNotLoaded("values", this.m_values, "TableRow", this._isNull);
				return this.m_values;
			},
			set: function (value) {
				this.m_values=value;
				_createSetPropertyAction(this.context, this, "Values", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "verticalAlignment", {
			get: function () {
				_throwIfNotLoaded("verticalAlignment", this.m_verticalAlignment, "TableRow", this._isNull);
				return this.m_verticalAlignment;
			},
			set: function (value) {
				this.m_verticalAlignment=value;
				_createSetPropertyAction(this.context, this, "VerticalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "TableRow", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRow.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableRow", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableRow.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["values", "shadingColor", "horizontalAlignment", "verticalAlignment", "preferredHeight"], ["font"], [
				"cells",
				"parentTable",
				"cells",
				"parentTable"
			]);
		};
		TableRow.prototype.clear=function () {
			_createMethodAction(this.context, this, "Clear", 0, []);
		};
		TableRow.prototype.delete=function () {
			_createMethodAction(this.context, this, "Delete", 0, []);
		};
		TableRow.prototype.getBorder=function (borderLocation) {
			return new Word.TableBorder(this.context, _createMethodObjectPath(this.context, this, "GetBorder", 1, [borderLocation], false, false, null));
		};
		TableRow.prototype.getCellPadding=function (cellPaddingLocation) {
			var action=_createMethodAction(this.context, this, "GetCellPadding", 1, [cellPaddingLocation]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		TableRow.prototype.getNext=function () {
			return new Word.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		TableRow.prototype.getNextOrNullObject=function () {
			return new Word.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		TableRow.prototype.insertRows=function (insertLocation, rowCount, values) {
			return new Word.TableRowCollection(this.context, _createMethodObjectPath(this.context, this, "InsertRows", 1, [insertLocation, rowCount, values], true, false, null));
		};
		TableRow.prototype.search=function (searchText, searchOptions) {
			searchOptions=_normalizeSearchOptions(this.context, searchOptions);
			return new Word.RangeCollection(this.context, _createMethodObjectPath(this.context, this, "Search", 1, [searchText, searchOptions], true, false, null));
		};
		TableRow.prototype.select=function (selectionMode) {
			_createMethodAction(this.context, this, "Select", 1, [selectionMode]);
		};
		TableRow.prototype.setCellPadding=function (cellPaddingLocation, cellPadding) {
			_createMethodAction(this.context, this, "SetCellPadding", 0, [cellPaddingLocation, cellPadding]);
		};
		TableRow.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableRow.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["CellCount"])) {
				this.m_cellCount=obj["CellCount"];
			}
			if (!_isUndefined(obj["HorizontalAlignment"])) {
				this.m_horizontalAlignment=obj["HorizontalAlignment"];
			}
			if (!_isUndefined(obj["IsHeader"])) {
				this.m_isHeader=obj["IsHeader"];
			}
			if (!_isUndefined(obj["PreferredHeight"])) {
				this.m_preferredHeight=obj["PreferredHeight"];
			}
			if (!_isUndefined(obj["RowIndex"])) {
				this.m_rowIndex=obj["RowIndex"];
			}
			if (!_isUndefined(obj["ShadingColor"])) {
				this.m_shadingColor=obj["ShadingColor"];
			}
			if (!_isUndefined(obj["Values"])) {
				this.m_values=obj["Values"];
			}
			if (!_isUndefined(obj["VerticalAlignment"])) {
				this.m_verticalAlignment=obj["VerticalAlignment"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["cells", "Cells", "font", "Font", "parentTable", "ParentTable"]);
		};
		TableRow.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableRow.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		TableRow.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableRow.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableRow.prototype.toJSON=function () {
			return {
				"cellCount": this.m_cellCount,
				"font": this.m_font,
				"horizontalAlignment": this.m_horizontalAlignment,
				"isHeader": this.m_isHeader,
				"preferredHeight": this.m_preferredHeight,
				"rowIndex": this.m_rowIndex,
				"shadingColor": this.m_shadingColor,
				"values": this.m_values,
				"verticalAlignment": this.m_verticalAlignment
			};
		};
		return TableRow;
	}(OfficeExtension.ClientObject));
	Word.TableRow=TableRow;
	var TableRowCollection=(function (_super) {
		__extends(TableRowCollection, _super);
		function TableRowCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableRowCollection.prototype, "_className", {
			get: function () {
				return "TableRowCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableRowCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableRowCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableRowCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableRowCollection.prototype.getFirst=function () {
			return new Word.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		TableRowCollection.prototype.getFirstOrNullObject=function () {
			return new Word.TableRow(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		TableRowCollection.prototype._GetItem=function (index) {
			return new Word.TableRow(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		TableRowCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableRowCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.TableRow(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableRowCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableRowCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		TableRowCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableRowCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableRowCollection.prototype.toJSON=function () {
			return {};
		};
		return TableRowCollection;
	}(OfficeExtension.ClientObject));
	Word.TableRowCollection=TableRowCollection;
	var TableCell=(function (_super) {
		__extends(TableCell, _super);
		function TableCell() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableCell.prototype, "_className", {
			get: function () {
				return "TableCell";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "body", {
			get: function () {
				if (!this.m_body) {
					this.m_body=new Word.Body(this.context, _createPropertyObjectPath(this.context, this, "Body", false, false));
				}
				return this.m_body;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "parentRow", {
			get: function () {
				if (!this.m_parentRow) {
					this.m_parentRow=new Word.TableRow(this.context, _createPropertyObjectPath(this.context, this, "ParentRow", false, false));
				}
				return this.m_parentRow;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "parentTable", {
			get: function () {
				if (!this.m_parentTable) {
					this.m_parentTable=new Word.Table(this.context, _createPropertyObjectPath(this.context, this, "ParentTable", false, false));
				}
				return this.m_parentTable;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "cellIndex", {
			get: function () {
				_throwIfNotLoaded("cellIndex", this.m_cellIndex, "TableCell", this._isNull);
				return this.m_cellIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "columnWidth", {
			get: function () {
				_throwIfNotLoaded("columnWidth", this.m_columnWidth, "TableCell", this._isNull);
				return this.m_columnWidth;
			},
			set: function (value) {
				this.m_columnWidth=value;
				_createSetPropertyAction(this.context, this, "ColumnWidth", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "horizontalAlignment", {
			get: function () {
				_throwIfNotLoaded("horizontalAlignment", this.m_horizontalAlignment, "TableCell", this._isNull);
				return this.m_horizontalAlignment;
			},
			set: function (value) {
				this.m_horizontalAlignment=value;
				_createSetPropertyAction(this.context, this, "HorizontalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "rowIndex", {
			get: function () {
				_throwIfNotLoaded("rowIndex", this.m_rowIndex, "TableCell", this._isNull);
				return this.m_rowIndex;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "shadingColor", {
			get: function () {
				_throwIfNotLoaded("shadingColor", this.m_shadingColor, "TableCell", this._isNull);
				return this.m_shadingColor;
			},
			set: function (value) {
				this.m_shadingColor=value;
				_createSetPropertyAction(this.context, this, "ShadingColor", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "value", {
			get: function () {
				_throwIfNotLoaded("value", this.m_value, "TableCell", this._isNull);
				return this.m_value;
			},
			set: function (value) {
				this.m_value=value;
				_createSetPropertyAction(this.context, this, "Value", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "verticalAlignment", {
			get: function () {
				_throwIfNotLoaded("verticalAlignment", this.m_verticalAlignment, "TableCell", this._isNull);
				return this.m_verticalAlignment;
			},
			set: function (value) {
				this.m_verticalAlignment=value;
				_createSetPropertyAction(this.context, this, "VerticalAlignment", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "width", {
			get: function () {
				_throwIfNotLoaded("width", this.m_width, "TableCell", this._isNull);
				return this.m_width;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "_Id", {
			get: function () {
				_throwIfNotLoaded("_Id", this.m__Id, "TableCell", this._isNull);
				return this.m__Id;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCell.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableCell", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableCell.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["value", "shadingColor", "horizontalAlignment", "verticalAlignment", "columnWidth"], ["body"], [
				"parentRow",
				"parentTable",
				"parentRow",
				"parentTable"
			]);
		};
		TableCell.prototype.deleteColumn=function () {
			_createMethodAction(this.context, this, "DeleteColumn", 0, []);
		};
		TableCell.prototype.deleteRow=function () {
			_createMethodAction(this.context, this, "DeleteRow", 0, []);
		};
		TableCell.prototype.getBorder=function (borderLocation) {
			return new Word.TableBorder(this.context, _createMethodObjectPath(this.context, this, "GetBorder", 1, [borderLocation], false, false, null));
		};
		TableCell.prototype.getCellPadding=function (cellPaddingLocation) {
			var action=_createMethodAction(this.context, this, "GetCellPadding", 1, [cellPaddingLocation]);
			var ret=new OfficeExtension.ClientResult();
			_addActionResultHandler(this, action, ret);
			return ret;
		};
		TableCell.prototype.getNext=function () {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetNext", 1, [], false, false, null));
		};
		TableCell.prototype.getNextOrNullObject=function () {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetNextOrNullObject", 1, [], false, false, null));
		};
		TableCell.prototype.insertColumns=function (insertLocation, columnCount, values) {
			_createMethodAction(this.context, this, "InsertColumns", 0, [insertLocation, columnCount, values]);
		};
		TableCell.prototype.insertRows=function (insertLocation, rowCount, values) {
			return new Word.TableRowCollection(this.context, _createMethodObjectPath(this.context, this, "InsertRows", 0, [insertLocation, rowCount, values], true, false, null));
		};
		TableCell.prototype.setCellPadding=function (cellPaddingLocation, cellPadding) {
			_createMethodAction(this.context, this, "SetCellPadding", 0, [cellPaddingLocation, cellPadding]);
		};
		TableCell.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableCell.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["CellIndex"])) {
				this.m_cellIndex=obj["CellIndex"];
			}
			if (!_isUndefined(obj["ColumnWidth"])) {
				this.m_columnWidth=obj["ColumnWidth"];
			}
			if (!_isUndefined(obj["HorizontalAlignment"])) {
				this.m_horizontalAlignment=obj["HorizontalAlignment"];
			}
			if (!_isUndefined(obj["RowIndex"])) {
				this.m_rowIndex=obj["RowIndex"];
			}
			if (!_isUndefined(obj["ShadingColor"])) {
				this.m_shadingColor=obj["ShadingColor"];
			}
			if (!_isUndefined(obj["Value"])) {
				this.m_value=obj["Value"];
			}
			if (!_isUndefined(obj["VerticalAlignment"])) {
				this.m_verticalAlignment=obj["VerticalAlignment"];
			}
			if (!_isUndefined(obj["Width"])) {
				this.m_width=obj["Width"];
			}
			if (!_isUndefined(obj["_Id"])) {
				this.m__Id=obj["_Id"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			_handleNavigationPropertyResults(this, obj, ["body", "Body", "parentRow", "ParentRow", "parentTable", "ParentTable"]);
		};
		TableCell.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableCell.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
			if (!_isUndefined(value["_Id"])) {
				this.m__Id=value["_Id"];
			}
		};
		TableCell.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableCell.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableCell.prototype.toJSON=function () {
			return {
				"body": this.m_body,
				"cellIndex": this.m_cellIndex,
				"columnWidth": this.m_columnWidth,
				"horizontalAlignment": this.m_horizontalAlignment,
				"rowIndex": this.m_rowIndex,
				"shadingColor": this.m_shadingColor,
				"value": this.m_value,
				"verticalAlignment": this.m_verticalAlignment,
				"width": this.m_width
			};
		};
		return TableCell;
	}(OfficeExtension.ClientObject));
	Word.TableCell=TableCell;
	var TableCellCollection=(function (_super) {
		__extends(TableCellCollection, _super);
		function TableCellCollection() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableCellCollection.prototype, "_className", {
			get: function () {
				return "TableCellCollection";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCellCollection.prototype, "items", {
			get: function () {
				_throwIfNotLoaded("items", this.m__items, "TableCellCollection", this._isNull);
				return this.m__items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableCellCollection.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableCellCollection", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableCellCollection.prototype.getFirst=function () {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetFirst", 1, [], false, false, null));
		};
		TableCellCollection.prototype.getFirstOrNullObject=function () {
			return new Word.TableCell(this.context, _createMethodObjectPath(this.context, this, "GetFirstOrNullObject", 1, [], false, false, null));
		};
		TableCellCollection.prototype._GetItem=function (index) {
			return new Word.TableCell(this.context, _createIndexerObjectPath(this.context, this, [index]));
		};
		TableCellCollection.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableCellCollection.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
			if (!_isNullOrUndefined(obj[OfficeExtension.Constants.items])) {
				this.m__items=[];
				var _data=obj[OfficeExtension.Constants.items];
				for (var i=0; i < _data.length; i++) {
					var _item=new Word.TableCell(this.context, _createChildItemObjectPathUsingIndexerOrGetItemAt(true, this.context, this, _data[i], i));
					_item._handleResult(_data[i]);
					this.m__items.push(_item);
				}
			}
		};
		TableCellCollection.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableCellCollection.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		TableCellCollection.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableCellCollection.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableCellCollection.prototype.toJSON=function () {
			return {};
		};
		return TableCellCollection;
	}(OfficeExtension.ClientObject));
	Word.TableCellCollection=TableCellCollection;
	var TableBorder=(function (_super) {
		__extends(TableBorder, _super);
		function TableBorder() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(TableBorder.prototype, "_className", {
			get: function () {
				return "TableBorder";
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableBorder.prototype, "color", {
			get: function () {
				_throwIfNotLoaded("color", this.m_color, "TableBorder", this._isNull);
				return this.m_color;
			},
			set: function (value) {
				this.m_color=value;
				_createSetPropertyAction(this.context, this, "Color", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableBorder.prototype, "type", {
			get: function () {
				_throwIfNotLoaded("type", this.m_type, "TableBorder", this._isNull);
				return this.m_type;
			},
			set: function (value) {
				this.m_type=value;
				_createSetPropertyAction(this.context, this, "Type", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableBorder.prototype, "width", {
			get: function () {
				_throwIfNotLoaded("width", this.m_width, "TableBorder", this._isNull);
				return this.m_width;
			},
			set: function (value) {
				this.m_width=value;
				_createSetPropertyAction(this.context, this, "Width", value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TableBorder.prototype, "_ReferenceId", {
			get: function () {
				_throwIfNotLoaded("_ReferenceId", this.m__ReferenceId, "TableBorder", this._isNull);
				return this.m__ReferenceId;
			},
			enumerable: true,
			configurable: true
		});
		TableBorder.prototype.set=function (properties, options) {
			this._recursivelySet(properties, options, ["color", "type", "width"], [], []);
		};
		TableBorder.prototype._KeepReference=function () {
			_createMethodAction(this.context, this, "_KeepReference", 1, []);
		};
		TableBorder.prototype._handleResult=function (value) {
			_super.prototype._handleResult.call(this, value);
			if (_isNullOrUndefined(value))
				return;
			var obj=value;
			_fixObjectPathIfNecessary(this, obj);
			if (!_isUndefined(obj["Color"])) {
				this.m_color=obj["Color"];
			}
			if (!_isUndefined(obj["Type"])) {
				this.m_type=obj["Type"];
			}
			if (!_isUndefined(obj["Width"])) {
				this.m_width=obj["Width"];
			}
			if (!_isUndefined(obj["_ReferenceId"])) {
				this.m__ReferenceId=obj["_ReferenceId"];
			}
		};
		TableBorder.prototype.load=function (option) {
			_load(this, option);
			return this;
		};
		TableBorder.prototype._handleIdResult=function (value) {
			_super.prototype._handleIdResult.call(this, value);
			if (_isNullOrUndefined(value)) {
				return;
			}
			if (!_isUndefined(value["_ReferenceId"])) {
				this.m__ReferenceId=value["_ReferenceId"];
			}
		};
		TableBorder.prototype.track=function () {
			this.context.trackedObjects.add(this);
			return this;
		};
		TableBorder.prototype.untrack=function () {
			this.context.trackedObjects.remove(this);
			return this;
		};
		TableBorder.prototype.toJSON=function () {
			return {
				"color": this.m_color,
				"type": this.m_type,
				"width": this.m_width
			};
		};
		return TableBorder;
	}(OfficeExtension.ClientObject));
	Word.TableBorder=TableBorder;
	var ContentControlType;
	(function (ContentControlType) {
		ContentControlType.unknown="Unknown";
		ContentControlType.richTextInline="RichTextInline";
		ContentControlType.richTextParagraphs="RichTextParagraphs";
		ContentControlType.richTextTableCell="RichTextTableCell";
		ContentControlType.richTextTableRow="RichTextTableRow";
		ContentControlType.richTextTable="RichTextTable";
		ContentControlType.plainTextInline="PlainTextInline";
		ContentControlType.plainTextParagraph="PlainTextParagraph";
		ContentControlType.picture="Picture";
		ContentControlType.buildingBlockGallery="BuildingBlockGallery";
		ContentControlType.checkBox="CheckBox";
		ContentControlType.comboBox="ComboBox";
		ContentControlType.dropDownList="DropDownList";
		ContentControlType.datePicker="DatePicker";
		ContentControlType.repeatingSection="RepeatingSection";
		ContentControlType.richText="RichText";
		ContentControlType.plainText="PlainText";
	})(ContentControlType=Word.ContentControlType || (Word.ContentControlType={}));
	var ContentControlAppearance;
	(function (ContentControlAppearance) {
		ContentControlAppearance.boundingBox="BoundingBox";
		ContentControlAppearance.tags="Tags";
		ContentControlAppearance.hidden="Hidden";
	})(ContentControlAppearance=Word.ContentControlAppearance || (Word.ContentControlAppearance={}));
	var UnderlineType;
	(function (UnderlineType) {
		UnderlineType.mixed="Mixed";
		UnderlineType.none="None";
		UnderlineType.hidden="Hidden";
		UnderlineType.dotLine="DotLine";
		UnderlineType.single="Single";
		UnderlineType.word="Word";
		UnderlineType.double="Double";
		UnderlineType.thick="Thick";
		UnderlineType.dotted="Dotted";
		UnderlineType.dottedHeavy="DottedHeavy";
		UnderlineType.dashLine="DashLine";
		UnderlineType.dashLineHeavy="DashLineHeavy";
		UnderlineType.dashLineLong="DashLineLong";
		UnderlineType.dashLineLongHeavy="DashLineLongHeavy";
		UnderlineType.dotDashLine="DotDashLine";
		UnderlineType.dotDashLineHeavy="DotDashLineHeavy";
		UnderlineType.twoDotDashLine="TwoDotDashLine";
		UnderlineType.twoDotDashLineHeavy="TwoDotDashLineHeavy";
		UnderlineType.wave="Wave";
		UnderlineType.waveHeavy="WaveHeavy";
		UnderlineType.waveDouble="WaveDouble";
	})(UnderlineType=Word.UnderlineType || (Word.UnderlineType={}));
	var BreakType;
	(function (BreakType) {
		BreakType.page="Page";
		BreakType.next="Next";
		BreakType.sectionNext="SectionNext";
		BreakType.sectionContinuous="SectionContinuous";
		BreakType.sectionEven="SectionEven";
		BreakType.sectionOdd="SectionOdd";
		BreakType.line="Line";
	})(BreakType=Word.BreakType || (Word.BreakType={}));
	var InsertLocation;
	(function (InsertLocation) {
		InsertLocation.before="Before";
		InsertLocation.after="After";
		InsertLocation.start="Start";
		InsertLocation.end="End";
		InsertLocation.replace="Replace";
	})(InsertLocation=Word.InsertLocation || (Word.InsertLocation={}));
	var Alignment;
	(function (Alignment) {
		Alignment.mixed="Mixed";
		Alignment.unknown="Unknown";
		Alignment.left="Left";
		Alignment.centered="Centered";
		Alignment.right="Right";
		Alignment.justified="Justified";
	})(Alignment=Word.Alignment || (Word.Alignment={}));
	var HeaderFooterType;
	(function (HeaderFooterType) {
		HeaderFooterType.primary="Primary";
		HeaderFooterType.firstPage="FirstPage";
		HeaderFooterType.evenPages="EvenPages";
	})(HeaderFooterType=Word.HeaderFooterType || (Word.HeaderFooterType={}));
	var BodyType;
	(function (BodyType) {
		BodyType.unknown="Unknown";
		BodyType.mainDoc="MainDoc";
		BodyType.section="Section";
		BodyType.header="Header";
		BodyType.footer="Footer";
		BodyType.tableCell="TableCell";
	})(BodyType=Word.BodyType || (Word.BodyType={}));
	var SelectionMode;
	(function (SelectionMode) {
		SelectionMode.select="Select";
		SelectionMode.start="Start";
		SelectionMode.end="End";
	})(SelectionMode=Word.SelectionMode || (Word.SelectionMode={}));
	var ImageFormat;
	(function (ImageFormat) {
		ImageFormat.unsupported="Unsupported";
		ImageFormat.undefined="Undefined";
		ImageFormat.bmp="Bmp";
		ImageFormat.jpeg="Jpeg";
		ImageFormat.gif="Gif";
		ImageFormat.tiff="Tiff";
		ImageFormat.png="Png";
		ImageFormat.icon="Icon";
		ImageFormat.exif="Exif";
		ImageFormat.wmf="Wmf";
		ImageFormat.emf="Emf";
		ImageFormat.pict="Pict";
		ImageFormat.pdf="Pdf";
		ImageFormat.svg="Svg";
	})(ImageFormat=Word.ImageFormat || (Word.ImageFormat={}));
	var RangeLocation;
	(function (RangeLocation) {
		RangeLocation.whole="Whole";
		RangeLocation.start="Start";
		RangeLocation.end="End";
		RangeLocation.before="Before";
		RangeLocation.after="After";
		RangeLocation.content="Content";
	})(RangeLocation=Word.RangeLocation || (Word.RangeLocation={}));
	var LocationRelation;
	(function (LocationRelation) {
		LocationRelation.unrelated="Unrelated";
		LocationRelation.equal="Equal";
		LocationRelation.containsStart="ContainsStart";
		LocationRelation.containsEnd="ContainsEnd";
		LocationRelation.contains="Contains";
		LocationRelation.insideStart="InsideStart";
		LocationRelation.insideEnd="InsideEnd";
		LocationRelation.inside="Inside";
		LocationRelation.adjacentBefore="AdjacentBefore";
		LocationRelation.overlapsBefore="OverlapsBefore";
		LocationRelation.before="Before";
		LocationRelation.adjacentAfter="AdjacentAfter";
		LocationRelation.overlapsAfter="OverlapsAfter";
		LocationRelation.after="After";
	})(LocationRelation=Word.LocationRelation || (Word.LocationRelation={}));
	var BorderLocation;
	(function (BorderLocation) {
		BorderLocation.top="Top";
		BorderLocation.left="Left";
		BorderLocation.bottom="Bottom";
		BorderLocation.right="Right";
		BorderLocation.insideHorizontal="InsideHorizontal";
		BorderLocation.insideVertical="InsideVertical";
		BorderLocation.inside="Inside";
		BorderLocation.outside="Outside";
		BorderLocation.all="All";
	})(BorderLocation=Word.BorderLocation || (Word.BorderLocation={}));
	var CellPaddingLocation;
	(function (CellPaddingLocation) {
		CellPaddingLocation.top="Top";
		CellPaddingLocation.left="Left";
		CellPaddingLocation.bottom="Bottom";
		CellPaddingLocation.right="Right";
	})(CellPaddingLocation=Word.CellPaddingLocation || (Word.CellPaddingLocation={}));
	var BorderType;
	(function (BorderType) {
		BorderType.mixed="Mixed";
		BorderType.none="None";
		BorderType.single="Single";
		BorderType.double="Double";
		BorderType.dotted="Dotted";
		BorderType.dashed="Dashed";
		BorderType.dotDashed="DotDashed";
		BorderType.dot2Dashed="Dot2Dashed";
		BorderType.triple="Triple";
		BorderType.thinThickSmall="ThinThickSmall";
		BorderType.thickThinSmall="ThickThinSmall";
		BorderType.thinThickThinSmall="ThinThickThinSmall";
		BorderType.thinThickMed="ThinThickMed";
		BorderType.thickThinMed="ThickThinMed";
		BorderType.thinThickThinMed="ThinThickThinMed";
		BorderType.thinThickLarge="ThinThickLarge";
		BorderType.thickThinLarge="ThickThinLarge";
		BorderType.thinThickThinLarge="ThinThickThinLarge";
		BorderType.wave="Wave";
		BorderType.doubleWave="DoubleWave";
		BorderType.dashedSmall="DashedSmall";
		BorderType.dashDotStroked="DashDotStroked";
		BorderType.threeDEmboss="ThreeDEmboss";
		BorderType.threeDEngrave="ThreeDEngrave";
	})(BorderType=Word.BorderType || (Word.BorderType={}));
	var VerticalAlignment;
	(function (VerticalAlignment) {
		VerticalAlignment.mixed="Mixed";
		VerticalAlignment.top="Top";
		VerticalAlignment.center="Center";
		VerticalAlignment.bottom="Bottom";
	})(VerticalAlignment=Word.VerticalAlignment || (Word.VerticalAlignment={}));
	var ListLevelType;
	(function (ListLevelType) {
		ListLevelType.bullet="Bullet";
		ListLevelType.number="Number";
		ListLevelType.picture="Picture";
	})(ListLevelType=Word.ListLevelType || (Word.ListLevelType={}));
	var ListBullet;
	(function (ListBullet) {
		ListBullet.custom="Custom";
		ListBullet.solid="Solid";
		ListBullet.hollow="Hollow";
		ListBullet.square="Square";
		ListBullet.diamonds="Diamonds";
		ListBullet.arrow="Arrow";
		ListBullet.checkmark="Checkmark";
	})(ListBullet=Word.ListBullet || (Word.ListBullet={}));
	var ListNumbering;
	(function (ListNumbering) {
		ListNumbering.none="None";
		ListNumbering.arabic="Arabic";
		ListNumbering.upperRoman="UpperRoman";
		ListNumbering.lowerRoman="LowerRoman";
		ListNumbering.upperLetter="UpperLetter";
		ListNumbering.lowerLetter="LowerLetter";
	})(ListNumbering=Word.ListNumbering || (Word.ListNumbering={}));
	var Style;
	(function (Style) {
		Style.other="Other";
		Style.normal="Normal";
		Style.heading1="Heading1";
		Style.heading2="Heading2";
		Style.heading3="Heading3";
		Style.heading4="Heading4";
		Style.heading5="Heading5";
		Style.heading6="Heading6";
		Style.heading7="Heading7";
		Style.heading8="Heading8";
		Style.heading9="Heading9";
		Style.toc1="Toc1";
		Style.toc2="Toc2";
		Style.toc3="Toc3";
		Style.toc4="Toc4";
		Style.toc5="Toc5";
		Style.toc6="Toc6";
		Style.toc7="Toc7";
		Style.toc8="Toc8";
		Style.toc9="Toc9";
		Style.footnoteText="FootnoteText";
		Style.header="Header";
		Style.footer="Footer";
		Style.caption="Caption";
		Style.footnoteReference="FootnoteReference";
		Style.endnoteReference="EndnoteReference";
		Style.endnoteText="EndnoteText";
		Style.title="Title";
		Style.subtitle="Subtitle";
		Style.hyperlink="Hyperlink";
		Style.strong="Strong";
		Style.emphasis="Emphasis";
		Style.noSpacing="NoSpacing";
		Style.listParagraph="ListParagraph";
		Style.quote="Quote";
		Style.intenseQuote="IntenseQuote";
		Style.subtleEmphasis="SubtleEmphasis";
		Style.intenseEmphasis="IntenseEmphasis";
		Style.subtleReference="SubtleReference";
		Style.intenseReference="IntenseReference";
		Style.bookTitle="BookTitle";
		Style.bibliography="Bibliography";
		Style.tocHeading="TocHeading";
		Style.tableGrid="TableGrid";
		Style.plainTable1="PlainTable1";
		Style.plainTable2="PlainTable2";
		Style.plainTable3="PlainTable3";
		Style.plainTable4="PlainTable4";
		Style.plainTable5="PlainTable5";
		Style.tableGridLight="TableGridLight";
		Style.gridTable1Light="GridTable1Light";
		Style.gridTable1Light_Accent1="GridTable1Light_Accent1";
		Style.gridTable1Light_Accent2="GridTable1Light_Accent2";
		Style.gridTable1Light_Accent3="GridTable1Light_Accent3";
		Style.gridTable1Light_Accent4="GridTable1Light_Accent4";
		Style.gridTable1Light_Accent5="GridTable1Light_Accent5";
		Style.gridTable1Light_Accent6="GridTable1Light_Accent6";
		Style.gridTable2="GridTable2";
		Style.gridTable2_Accent1="GridTable2_Accent1";
		Style.gridTable2_Accent2="GridTable2_Accent2";
		Style.gridTable2_Accent3="GridTable2_Accent3";
		Style.gridTable2_Accent4="GridTable2_Accent4";
		Style.gridTable2_Accent5="GridTable2_Accent5";
		Style.gridTable2_Accent6="GridTable2_Accent6";
		Style.gridTable3="GridTable3";
		Style.gridTable3_Accent1="GridTable3_Accent1";
		Style.gridTable3_Accent2="GridTable3_Accent2";
		Style.gridTable3_Accent3="GridTable3_Accent3";
		Style.gridTable3_Accent4="GridTable3_Accent4";
		Style.gridTable3_Accent5="GridTable3_Accent5";
		Style.gridTable3_Accent6="GridTable3_Accent6";
		Style.gridTable4="GridTable4";
		Style.gridTable4_Accent1="GridTable4_Accent1";
		Style.gridTable4_Accent2="GridTable4_Accent2";
		Style.gridTable4_Accent3="GridTable4_Accent3";
		Style.gridTable4_Accent4="GridTable4_Accent4";
		Style.gridTable4_Accent5="GridTable4_Accent5";
		Style.gridTable4_Accent6="GridTable4_Accent6";
		Style.gridTable5Dark="GridTable5Dark";
		Style.gridTable5Dark_Accent1="GridTable5Dark_Accent1";
		Style.gridTable5Dark_Accent2="GridTable5Dark_Accent2";
		Style.gridTable5Dark_Accent3="GridTable5Dark_Accent3";
		Style.gridTable5Dark_Accent4="GridTable5Dark_Accent4";
		Style.gridTable5Dark_Accent5="GridTable5Dark_Accent5";
		Style.gridTable5Dark_Accent6="GridTable5Dark_Accent6";
		Style.gridTable6Colorful="GridTable6Colorful";
		Style.gridTable6Colorful_Accent1="GridTable6Colorful_Accent1";
		Style.gridTable6Colorful_Accent2="GridTable6Colorful_Accent2";
		Style.gridTable6Colorful_Accent3="GridTable6Colorful_Accent3";
		Style.gridTable6Colorful_Accent4="GridTable6Colorful_Accent4";
		Style.gridTable6Colorful_Accent5="GridTable6Colorful_Accent5";
		Style.gridTable6Colorful_Accent6="GridTable6Colorful_Accent6";
		Style.gridTable7Colorful="GridTable7Colorful";
		Style.gridTable7Colorful_Accent1="GridTable7Colorful_Accent1";
		Style.gridTable7Colorful_Accent2="GridTable7Colorful_Accent2";
		Style.gridTable7Colorful_Accent3="GridTable7Colorful_Accent3";
		Style.gridTable7Colorful_Accent4="GridTable7Colorful_Accent4";
		Style.gridTable7Colorful_Accent5="GridTable7Colorful_Accent5";
		Style.gridTable7Colorful_Accent6="GridTable7Colorful_Accent6";
		Style.listTable1Light="ListTable1Light";
		Style.listTable1Light_Accent1="ListTable1Light_Accent1";
		Style.listTable1Light_Accent2="ListTable1Light_Accent2";
		Style.listTable1Light_Accent3="ListTable1Light_Accent3";
		Style.listTable1Light_Accent4="ListTable1Light_Accent4";
		Style.listTable1Light_Accent5="ListTable1Light_Accent5";
		Style.listTable1Light_Accent6="ListTable1Light_Accent6";
		Style.listTable2="ListTable2";
		Style.listTable2_Accent1="ListTable2_Accent1";
		Style.listTable2_Accent2="ListTable2_Accent2";
		Style.listTable2_Accent3="ListTable2_Accent3";
		Style.listTable2_Accent4="ListTable2_Accent4";
		Style.listTable2_Accent5="ListTable2_Accent5";
		Style.listTable2_Accent6="ListTable2_Accent6";
		Style.listTable3="ListTable3";
		Style.listTable3_Accent1="ListTable3_Accent1";
		Style.listTable3_Accent2="ListTable3_Accent2";
		Style.listTable3_Accent3="ListTable3_Accent3";
		Style.listTable3_Accent4="ListTable3_Accent4";
		Style.listTable3_Accent5="ListTable3_Accent5";
		Style.listTable3_Accent6="ListTable3_Accent6";
		Style.listTable4="ListTable4";
		Style.listTable4_Accent1="ListTable4_Accent1";
		Style.listTable4_Accent2="ListTable4_Accent2";
		Style.listTable4_Accent3="ListTable4_Accent3";
		Style.listTable4_Accent4="ListTable4_Accent4";
		Style.listTable4_Accent5="ListTable4_Accent5";
		Style.listTable4_Accent6="ListTable4_Accent6";
		Style.listTable5Dark="ListTable5Dark";
		Style.listTable5Dark_Accent1="ListTable5Dark_Accent1";
		Style.listTable5Dark_Accent2="ListTable5Dark_Accent2";
		Style.listTable5Dark_Accent3="ListTable5Dark_Accent3";
		Style.listTable5Dark_Accent4="ListTable5Dark_Accent4";
		Style.listTable5Dark_Accent5="ListTable5Dark_Accent5";
		Style.listTable5Dark_Accent6="ListTable5Dark_Accent6";
		Style.listTable6Colorful="ListTable6Colorful";
		Style.listTable6Colorful_Accent1="ListTable6Colorful_Accent1";
		Style.listTable6Colorful_Accent2="ListTable6Colorful_Accent2";
		Style.listTable6Colorful_Accent3="ListTable6Colorful_Accent3";
		Style.listTable6Colorful_Accent4="ListTable6Colorful_Accent4";
		Style.listTable6Colorful_Accent5="ListTable6Colorful_Accent5";
		Style.listTable6Colorful_Accent6="ListTable6Colorful_Accent6";
		Style.listTable7Colorful="ListTable7Colorful";
		Style.listTable7Colorful_Accent1="ListTable7Colorful_Accent1";
		Style.listTable7Colorful_Accent2="ListTable7Colorful_Accent2";
		Style.listTable7Colorful_Accent3="ListTable7Colorful_Accent3";
		Style.listTable7Colorful_Accent4="ListTable7Colorful_Accent4";
		Style.listTable7Colorful_Accent5="ListTable7Colorful_Accent5";
		Style.listTable7Colorful_Accent6="ListTable7Colorful_Accent6";
	})(Style=Word.Style || (Word.Style={}));
	var DocumentPropertyType;
	(function (DocumentPropertyType) {
		DocumentPropertyType.string="String";
		DocumentPropertyType.number="Number";
		DocumentPropertyType.date="Date";
		DocumentPropertyType.boolean="Boolean";
	})(DocumentPropertyType=Word.DocumentPropertyType || (Word.DocumentPropertyType={}));
	var ErrorCodes;
	(function (ErrorCodes) {
		ErrorCodes.accessDenied="AccessDenied";
		ErrorCodes.generalException="GeneralException";
		ErrorCodes.invalidArgument="InvalidArgument";
		ErrorCodes.itemNotFound="ItemNotFound";
		ErrorCodes.notImplemented="NotImplemented";
	})(ErrorCodes=Word.ErrorCodes || (Word.ErrorCodes={}));
})(Word || (Word={}));
var Word;
(function (Word) {
	var RequestContext=(function (_super) {
		__extends(RequestContext, _super);
		function RequestContext(url) {
			_super.call(this, url);
			this.m_document=new Word.Document(this, OfficeExtension.ObjectPathFactory.createGlobalObjectObjectPath(this));
			this._rootObject=this.m_document;
		}
		Object.defineProperty(RequestContext.prototype, "document", {
			get: function () {
				return this.m_document;
			},
			enumerable: true,
			configurable: true
		});
		return RequestContext;
	}(OfficeExtension.ClientRequestContext));
	Word.RequestContext=RequestContext;
	function run(arg1, arg2) {
		return OfficeExtension.ClientRequestContext._runBatch("Word.run", arguments, function () { return new Word.RequestContext(); });
	}
	Word.run=run;
})(Word || (Word={}));


