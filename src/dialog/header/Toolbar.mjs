import Base from '../../toolbar/Base.mjs';

/**
 * @class Neo.dialog.header.Toolbar
 * @extends Neo.toolbar.Base
 */
class Toolbar extends Base {
    static config = {
        /**
         * @member {String} className='Neo.dialog.header.Toolbar'
         * @protected
         */
        className: 'Neo.dialog.header.Toolbar',
        /**
         * @member {String|null} title=null
         */
        title_: null
    }

    /**
     * @member {Object} actionMap
     */
    actionMap = {
        close   : () => ({action: 'close',    iconCls: 'far fa-window-close'}),
        maximize: () => ({action: 'maximize', iconCls: 'far fa-window-maximize'})
    }
    /**
     * You can define the action order and directly add custom actions.
     * @example
     * {
     *     actions: [
     *         'close',
     *         'maximize',
     *         {action: 'help', iconCls: 'far fa-circle-question'}
     *     ]
     * }
     *
     * You can also extend the actionMap if needed.
     * @member {Object[]|String[]|null} actions=['maximize','close']
     */
    actions = ['maximize', 'close']

    /**
     * Triggered after the title config got changed
     * @param {String} value
     * @param {String} oldValue
     * @protected
     */
    afterSetTitle(value, oldValue) {
        this.down({flag: 'title-label'})?.set({
            hidden: !value,
            text  : value
        })
    }

    /**
     *
     */
    createItems() {
        let me      = this,
            handler = me.fireAction.bind(me),
            items   = me.items || [];

        items.push({
            ntype : 'label',
            cls   : ['neo-panel-header-text', 'neo-label'],
            flag  : 'title-label',
            hidden: !me.title,
            text  : me.title
        });

        if (me.actions) {
            items.push('->');

            me.actions.forEach(action => {
                if (Neo.typeOf(action) !== 'Object') {
                    action = me.actionMap[action]()
                }

                items.push({handler, ...action})
            })
        }

        me.items = items;

        super.createItems();
    }

    /**
     * @param {Object} data
     */
    fireAction(data) {
        let component = data.component;

        this.fire('headerAction', {
            action: component.action,
            component,
            scope : this
        })
    }
}

Neo.applyClassConfig(Toolbar);

export default Toolbar;
