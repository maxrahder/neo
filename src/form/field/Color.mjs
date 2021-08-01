import ColorList from '../../list/Color.mjs'
import Select    from './Select.mjs';
import VDomUtil  from '../../util/VDom.mjs';

/**
 * @class Neo.form.field.Color
 * @extends Neo.form.field.Select
 */
class Color extends Select {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.form.field.Color'
         * @protected
         */
        className: 'Neo.form.field.Color',
        /**
         * @member {String} ntype='colorfield'
         * @protected
         */
        ntype: 'colorfield',
        /**
         * @member {String[]} cls=['neo-colorfield','neo-selectfield','neo-pickerfield','neo-textfield']
         */
        cls: ['neo-colorfield', 'neo-selectfield', 'neo-pickerfield', 'neo-textfield'],
        /**
         * The data.Model field which contains the color value
         * @member {String} colorField='name'
         */
        colorField: 'name',
        /**
         * @member {Object|null} listConfig
         */
        listConfig: {
            module            : ColorList,
            colorField        : '@config:colorField',
            silentSelectUpdate: true
        }
    }}

    /**
     *
     * @param {Object} config
     */
    constructor(config) {
        super(config);

        let me           = this,
            vdom         = me.vdom,
            inputWrapper = VDomUtil.findVdomChild(vdom, {id: me.getInputWrapperId()});

        inputWrapper.vdom.cn.unshift({
            cls  : 'neo-color',
            id   : me.getColorIndicatorId(),
            style: {
                backgroundColor: me.getColor()
            }
        });

        me.vdom = vdom;
    }

    /**
     * Triggered after the value config got changed
     * @param {Number|String|null} value
     * @param {Number|String|null} oldValue
     * @param {Boolean} [preventFilter=false]
     * @protected
     */
    afterSetValue(value, oldValue, preventFilter=false) {
        let me             = this,
            colorIndicator = VDomUtil.findVdomChild(me.vdom, {id: me.getColorIndicatorId()})?.vdom,
            list           = me.list,
            record         = me.record,
            selectionModel = me.list?.selectionModel;

        if (colorIndicator) {
            colorIndicator.style.backgroundColor = me.getColor();
        }

        if (record) {
            selectionModel?.select(list.getItemId(record[me.store.keyProperty]));
        } else {
            selectionModel?.deselectAll(true);
        }

        // the super call will trigger the vdom update
        super.afterSetValue(value, oldValue, preventFilter);
    }

    /**
     *
     * @returns {String}
     */
    getColor() {
        let me     = this,
            record = me.record,
            value  = me.value;

        return record ? record[me.colorField] : me.forceSelection ? null : value;
    }

    /**
     *
     * @returns {String}
     */
    getColorIndicatorId() {
        return `${this.id}__color-indicator`;
    }

    /**
     * @protected
     */
    onSelectPostLastItem() {
        let list  = this.list,
            index = list.store.getCount() - 1;

        list.vdom.cn[index] = list.createItem(list.store.getAt(index), index);

        super.onSelectPostLastItem();
    }

    /**
     * @protected
     */
    onSelectPreFirstItem() {
        let list = this.list;

        list.vdom.cn[0] = list.createItem(list.store.getAt(0), 0);

        super.onSelectPreFirstItem();
    }
}

Neo.applyClassConfig(Color);

export {Color as default};