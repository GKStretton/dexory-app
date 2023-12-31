/* tslint:disable */
/* eslint-disable */
/**
 * Dexory API
 * Dexory platform api for warehouse tracking
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { LocationScan } from './LocationScan';
import {
    LocationScanFromJSON,
    LocationScanFromJSONTyped,
    LocationScanToJSON,
} from './LocationScan';

/**
 * 
 * @export
 * @interface MachineReportsGet200Response
 */
export interface MachineReportsGet200Response {
    /**
     * 
     * @type {string}
     * @memberof MachineReportsGet200Response
     */
    reportName?: string;
    /**
     * 
     * @type {Array<Array<LocationScan>>}
     * @memberof MachineReportsGet200Response
     */
    report?: Array<Array<LocationScan>>;
}

/**
 * Check if a given object implements the MachineReportsGet200Response interface.
 */
export function instanceOfMachineReportsGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function MachineReportsGet200ResponseFromJSON(json: any): MachineReportsGet200Response {
    return MachineReportsGet200ResponseFromJSONTyped(json, false);
}

export function MachineReportsGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): MachineReportsGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'reportName': !exists(json, 'report_name') ? undefined : json['report_name'],
        'report': !exists(json, 'report') ? undefined : json['report'],
    };
}

export function MachineReportsGet200ResponseToJSON(value?: MachineReportsGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'report_name': value.reportName,
        'report': value.report,
    };
}

