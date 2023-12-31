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
/**
 * 
 * @export
 * @interface LocationComparison
 */
export interface LocationComparison {
    /**
     * The name of the location
     * @type {string}
     * @memberof LocationComparison
     */
    name: string;
    /**
     * Whether or not the location was successfully scanned
     * @type {boolean}
     * @memberof LocationComparison
     */
    scanned: boolean;
    /**
     * Whether or not the location was occupied
     * @type {boolean}
     * @memberof LocationComparison
     */
    occupied: boolean;
    /**
     * The barcodes that were expected to be found in this location
     * @type {Array<string>}
     * @memberof LocationComparison
     */
    expectedBarcodes: Array<string>;
    /**
     * The barcodes that were actually found in this location
     * @type {Array<string>}
     * @memberof LocationComparison
     */
    detectedBarcodes: Array<string>;
    /**
     * The status resulting from the comparison
     * @type {string}
     * @memberof LocationComparison
     */
    status: LocationComparisonStatusEnum;
}


/**
 * @export
 */
export const LocationComparisonStatusEnum = {
    NotScanned: 'Not scanned',
    EmptyAsExpected: 'Empty, as expected',
    EmptyButItShouldHaveBeenOccupied: 'Empty, but it should have been occupied',
    OccupiedByTheExpectedItems: 'Occupied by the expected items',
    OccupiedByTheWrongItems: 'Occupied by the wrong items',
    OccupiedByAnItemButShouldHaveBeenEmpty: 'Occupied by an item, but should have been empty',
    OccupiedButNoBarcodeCouldBeIdentified: 'Occupied, but no barcode could be identified'
} as const;
export type LocationComparisonStatusEnum = typeof LocationComparisonStatusEnum[keyof typeof LocationComparisonStatusEnum];


/**
 * Check if a given object implements the LocationComparison interface.
 */
export function instanceOfLocationComparison(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "scanned" in value;
    isInstance = isInstance && "occupied" in value;
    isInstance = isInstance && "expectedBarcodes" in value;
    isInstance = isInstance && "detectedBarcodes" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function LocationComparisonFromJSON(json: any): LocationComparison {
    return LocationComparisonFromJSONTyped(json, false);
}

export function LocationComparisonFromJSONTyped(json: any, ignoreDiscriminator: boolean): LocationComparison {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'scanned': json['scanned'],
        'occupied': json['occupied'],
        'expectedBarcodes': json['expected_barcodes'],
        'detectedBarcodes': json['detected_barcodes'],
        'status': json['status'],
    };
}

export function LocationComparisonToJSON(value?: LocationComparison | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'scanned': value.scanned,
        'occupied': value.occupied,
        'expected_barcodes': value.expectedBarcodes,
        'detected_barcodes': value.detectedBarcodes,
        'status': value.status,
    };
}

