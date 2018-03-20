import XElement from '/libraries/x-element/x-element.js';
import XAccount from './x-account.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XNoContent from './x-no-content.js';

export default class XAccountsList extends MixinRedux(XElement) {
    html() {
        return `
            <x-loading-animation></x-loading-animation>
            <h2>Loading accounts...</h2>
        `;
    }

    onCreate() {
        super.onCreate();
        this._accountEntries = new Map();
    }

    static mapStateToProps(state) {
        return {
            accounts: state.accounts.entries,
            hasContent: state.accounts.hasContent,
            loading: state. accounts.loading,
            error: state.accounts.error
        };
    }

    _onPropertiesChanged(changes) {
        const { hasContent, accounts } = this.properties;

        if (!hasContent) return;

        if (changes.accounts) {
            if (this.$('x-loading-animation')) {
                this.$el.textContent = ''; // remove loading animation
            }

            for (const [ address, account ] of changes.accounts) {
                const $account = this._accountEntries.get(address);
                if (account === undefined) {
                    // todo test!
                    $account && $account.destroy();
                    this._accountEntries.delete(address);
                } else {
                    if ($account) $account.setProperties(account);
                    else this._addAccountEntry(account);
                }
            }
        }

        if (accounts.size === 0) {
            this.$el.textContent = '';
            const $noContent = XNoContent.createElement();
            this.$el.appendChild($noContent.$el);
        }
    }

    /**
     * @param {object} account
     */
    _addAccountEntry(account) {
        const accountEntry = this._createAccountEntry(account);
        this._accountEntries.set(account.address, accountEntry);
        this.$el.appendChild(accountEntry.$el);
    }

    _createAccountEntry(account) {
        const $account = XAccount.createElement();

        $account.setProperties({
            ...account
        });

        return $account;
    }
}