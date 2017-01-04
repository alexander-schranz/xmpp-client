'use strict';

require('strophe.js');

export default class XmppClient {

    /**
     * Create a new xmpp client.
     *
     * @param {string} bosh
     * @param {string} id
     */
    constructor (bosh, id) {
        this.bosh = bosh;
        this.id = id;
    }

    /**
     * Login into xmpp server.
     *
     * @param {string} password
     *
     * @returns {Promise}
     */
    login (password) {
        return new Promise((resolve, error) => {
            // console.log(stropheJs);
        });
    }
}
