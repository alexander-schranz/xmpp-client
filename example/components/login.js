import $ from 'jquery';
import view from '../services/view.js';
import XmppClient from '../../dist/xmpp-client.js';

export default class Login {

    /**
     * Login need a template to be set.
     *
     * @param {string} html
     */
    constructor(html) {
        view.set(html);
        this.initSelectors();
        this.initEvents();
        this.loadInputs();
    }

    /**
     * Init selectors.
     */
    initSelectors() {
        this.$form = $('#login-form');
        this.$id = $('#id');
        this.$bosh = $('#bosh');
        this.$password = $('#password');
    }

    /**
     * Init dom events.
     */
    initEvents() {
        // Submit listener
        this.$form.submit(function(event) {
            event.preventDefault();

            var xmpp = new XmppClient(this.$bosh.val(), this.$id.val());
            xmpp.login(this.$password.val()).then(function() {
                alert('logged in');
            });
        }.bind(this));

        // Email Listener
        this.$id.keyup(this.updateBosh.bind(this));
        this.$id.change(this.saveInputs.bind(this));
        this.$bosh.change(this.saveInputs.bind(this));
    }

    /**
     * Update bosh from id value.
     */
    updateBosh() {
        var idParts = this.$id.val().split('@');

        if (idParts[1]) {
            this.$bosh.val('https://' + idParts[1] + ':5281/http-bind')
            this.saveInputs();
        }
    }

    /**
     * Save id to local storage.
     */
    saveInputs() {
        localStorage.id = this.$id.val();
        localStorage.bosh = this.$bosh.val();
    }

    /**
     * Load id from local storage.
     */
    loadInputs() {
        this.$id.val(localStorage.id);
        this.$bosh.val(localStorage.bosh);

        if (localStorage.id) {
            this.$password.focus();
        } else {
            this.$id.focus();
        }
    }
}
