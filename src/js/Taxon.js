/**
 * @module Taxon
 * @author Erik Pearson
 * @version 0.1.0
 * @param {TaxonLibrary} taxon
 * @param {TriftLibrary} Thrift
 * @param {BluebirdPromise} Promise
 * @returns {Taxon_L12.factory}
 */
/*global define*/
/*jslint white: true, browser: true*/
define([
    'bluebird',
    'taxon_service',
    'thrift',
    'kb_data_shared',
    
    // These don't have representations. Loading them causes the Thrift module
    // to be enhanced with additional properties (typically just a single
    //  property, the new capability added.)
    'thrift_transport_xhr',
    'thrift_protocol_binary'
], function (Promise, taxon, Thrift, KbShared) {
    'use strict';

    /**
     * Represents an interface to the Taxon data service.
     * @alias module:Taxon
     * @constructs Taxon
     * @param {object} config
     * @param {ObjectReference} config.ref The object reference for the object to be accessed.
     * @param {string} config.url The url for the Taxon Service endpoint.
     * @param {string} config.token The KBase authorization token to be used to access the service.
     * @returns {Taxon} A taxon api object
     */
    var Taxon = function (config) {

        KbShared.validate_config(config);
        
        var objectReference = config.ref,
            dataAPIUrl = config.url,
            authToken = config.token,
            timeout = config.timeout;

        if (!timeout) {
            timeout = 30000;
        }

        function client() {
            return KbShared.connect(Thrift, taxon, dataAPIUrl, timeout);
        }

        /**
         * If the Taxon has a parent object, this is returned. Otherwise,
         * it is ...
         *
         * @returns {Promise<ObjectReference|Error>} An object reference string
         * @throws {ThriftClientError} For networking and client side issues. These errors
         * are detected by the front end (javascript) code.
         * @throws {ThriftServiceError} For errors generated by the back end service.
         *
         */
        function get_parent() {
            return Promise.resolve(client().get_parent(authToken, objectReference, true));
        }

        /**
         * Get a array of object reference strings which are children (sub objects)
         * of this Taxon.
         *
         * @returns {Array<ObjectReference>} An array of object references representing the children of this object.
         */
        function get_children() {
            return Promise.resolve(client().get_children(authToken, objectReference, true));
        }

        /**
         *
         * @returns {Array<String>} An array of genome annotation strings
         */
        function get_genome_annotations() {
            return Promise.resolve(client().get_genome_annotations(authToken, objectReference, true));
        }

        /**
         * Get a list of taxonomic groups the species belongs to, with least specific first,
         * and most specific, that is the species itself, last.
         *
         * @returns {Array<String>} The lineage for this taxon, as an ordered list of taxonomic
         * ranks from least specific to most specific.
         *
         * @example
         *
         * Life
         *   Domain
         *     Kingdom
         *       Phylum
         *         Clas
         *           Order
         *             Family
         *               Genus
         *                 Species
         *
         */
        function get_scientific_lineage() {
           return Promise.resolve(client()
                .get_scientific_lineage(authToken, objectReference, true))
              .then(function (data) {
                  var str_data = data + ''
                  var r = str_data.split(',')
                    .map(function (x) { return x.trim(' ') })
                  return r
              })
        }

        /**
         *
         * @returns {String}
         */
        function get_scientific_name() {
            return Promise.resolve(client().get_scientific_name(authToken, objectReference, true));
        }

        /**
         *
         * @returns {Number}
         */
        function get_taxonomic_id() {
            return Promise.resolve(client().get_taxonomic_id(authToken, objectReference, true));
        }

        /**
         *
         * @returns {String}
         */
        function get_kingdom() {
            return Promise.resolve(client().get_kingdom(authToken, objectReference, true));
        }

        /**
         *
         * @returns {String}
         */
        function get_domain() {
            return Promise.resolve(client().get_domain(authToken, objectReference, true));
        }

        /**
         * The NCBI genetic code for the species.
         *
         * @returns {Number}
         * @see {@link http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi} NCBI "The Genetic Codes"
         */
        function get_genetic_code() {
            return Promise.resolve(client().get_genetic_code(authToken, objectReference, true));
        }

        /**
         *
         * @returns {Array<String>}
         */
        function get_aliases() {
            return Promise.resolve(client().get_aliases(authToken, objectReference, true));
        }

        // API
        return Object.freeze({
            get_parent: get_parent,
            get_children: get_children,
            get_genome_annotations: get_genome_annotations,
            get_scientific_lineage: get_scientific_lineage,
            get_scientific_name: get_scientific_name,
            get_taxonomic_id: get_taxonomic_id,
            get_kingdom: get_kingdom,
            get_domain: get_domain,
            get_genetic_code: get_genetic_code,
            get_aliases: get_aliases
        });

    };

    return Taxon;
});
