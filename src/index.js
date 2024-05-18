require('./index.css');

const headerIcon = require('./icons/header.js');
const h1Icon = require('./icons/h1.js');
const h2Icon = require('./icons/h2.js');
const h3Icon = require('./icons/h3.js');
const h4Icon = require('./icons/h4.js');
const h5Icon = require('./icons/h5.js');
const h6Icon = require('./icons/h6.js');
const getAlignmentIcon = require('./icons/alignment.js');

/**
 * Header plugin for Editor.js
 * Supported config:
 *     * placeholder {string} (Default: '')
 *     * levels {number[]} (Default: [1, 2, 3, 4, 5, 6])
 *     * defaultLevel {number} (Default: 1)
 *     * alignTypes {string[]} (Default: Header.ALIGN_TYPES)
 *     * defaultAlignType {string} (Default: 'left')
 *
 * @class Header
 * @typedef {Header}
 */
export default class Header {
  /**
   * Editor.js Toolbox settings
   *
   * @static
   * @readonly
   * @type {{ icon: any; title: string; }}
   */
  static get toolbox() {
    return {
      icon: headerIcon, title: 'Heading',
    };
  }

  /**
   * To notify Editor.js core that read-only is supported
   *
   * @static
   * @readonly
   * @type {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * All supported header levels
   *
   * @static
   * @readonly
   * @type {[{ id: number; tag: string; icon: any; }]}
   */
  static get HEADER_LEVELS() {
    return [
      { id: 1, tag: 'H1', icon: h1Icon },
      { id: 2, tag: 'H2', icon: h2Icon },
      { id: 3, tag: 'H3', icon: h3Icon },
      { id: 4, tag: 'H4', icon: h4Icon },
      { id: 5, tag: 'H5', icon: h5Icon },
      { id: 6, tag: 'H6', icon: h6Icon },
    ];
  }

  /**
   * Default header level
   *
   * @static
   * @readonly
   * @type {{ id: number; tag: string; icon: any; }}
   */
  static get DEFAULT_HEADER_LEVEL() {
    return { id: 1, tag: 'H1', icon: h1Icon };
  }

  /**
   * All supported alignment types
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get ALIGN_TYPES() {
    return ['left', 'center', 'right', 'justify'];
  }

  /**
   * Default alignment type
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_ALIGN_TYPE() {
    return 'left';
  }

  /**
   * Automatic sanitize config for Editor.js
   *
   * @static
   * @readonly
   * @type {{ text: {}; level: boolean; align: boolean; }}
   */
  static get sanitize() {
    return {
      text: {},
      level: false,
      align: false,
    };
  }

  /**
   * Editor.js config to convert one block to another
   *
   * @static
   * @readonly
   * @type {{ export: string; import: string; }}
   */
  static get conversionConfig() {
    return {
      export: 'text', // this property of tool data will be used as string to pass to other tool
      import: 'text', // to this property imported string will be passed
    };
  }

  /**
   * Editor.js config to substitute pasted HTML
   *
   * @static
   * @readonly
   * @type {{ tags: string[] }}
   */
  static get pasteConfig() {
    return {
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    };
  }

  /**
   * Creates an instance of Header.
   *
   * @constructor
   * @param {{ api: {}; readOnly: boolean; config: {}; data: {}; }} props
   */
  constructor({
    api, readOnly, config, data,
  }) {
    this._api = api;
    this._readOnly = readOnly;
    this._config = config || {};
    this._data = this._normalizeData(data);
    this._CSS = {
      wrapper: 'ce-header',
      wrapperForAlignment: (alignType) => `ce-header-align-${alignType}`,
    };
    this._element = this._getElement();
  }

  /**
   * All available header levels
   * - Finds intersection between supported and user selected levels
   *
   * @readonly
   * @type {[{ id: number; tag: string; icon: any; }]}
   */
  get availableLevels() {
    return this._config.levels ? Header.HEADER_LEVELS.filter(
      (level) => this._config.levels.includes(level.id),
    ) : Header.HEADER_LEVELS;
  }

  /**
   * User's default header level
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {{ id: number; tag: string; icon: any; }}
   */
  get userDefaultLevel() {
    if (this._config.defaultLevel) {
      const userSpecified = this.availableLevels.find(
        (levelItem) => levelItem.id === parseInt(this._config.defaultLevel, 10),
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Heading Tool: the default level specified was not found in available levels');
    }
    return Header.DEFAULT_HEADER_LEVEL;
  }

  /**
   * All available alignment types
   * - Finds intersection between supported and user selected alignment types
   *
   * @readonly
   * @type {string[]}
   */
  get availableAlignTypes() {
    return this._config.alignTypes ? Header.ALIGN_TYPES.filter(
      (align) => this._config.alignTypes.includes(align),
    ) : Header.ALIGN_TYPES;
  }

  /**
   * User's default alignment type
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultAlignType() {
    if (this._config.defaultAlignType) {
      const userSpecified = this.availableAlignTypes.find(
        (align) => align === this._config.defaultAlignType,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Heading Tool: the default align type specified is invalid');
    }
    return Header.DEFAULT_ALIGN_TYPE;
  }

  /**
   * To normalize input data
   *
   * @param {*} data
   * @returns {{ text: string; level: number; align: string; }}
   */
  _normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') {
      data = {};
    }

    newData.text = data.text || '';
    newData.level = parseInt(data.level, 10) || this.userDefaultLevel.id;
    newData.align = data.align || this.userDefaultAlignType;
    return newData;
  }

  /**
   * Current header level
   *
   * @readonly
   * @type {{ id: number; tag: string; icon: any; }}
   */
  get currentLevel() {
    let level = this.availableLevels.find((levelItem) => levelItem.id === this._data.level);
    if (!level) {
      level = this.userDefaultLevel;
    }
    return level;
  }

  /**
   * Current alignment type
   *
   * @readonly
   * @type {string}
   */
  get currentAlignType() {
    let alignType = this.availableAlignTypes.find((align) => align === this._data.align);
    if (!alignType) {
      alignType = this.userDefaultAlignType;
    }
    return alignType;
  }

  /**
   * Create and return block element
   *
   * @returns {*}
   */
  _getElement() {
    const tag = document.createElement(this.currentLevel.tag);
    tag.innerHTML = this._data.text || '';
    tag.classList.add(this._CSS.wrapper, this._CSS.wrapperForAlignment(this.currentAlignType));
    tag.contentEditable = !this._readOnly;
    tag.dataset.placeholder = this._api.i18n.t(this._config.placeholder || '');
    return tag;
  }

  /**
   * Callback for Header block tune setting
   *
   * @param {number} newLevel
   */
  _setHeaderLevel(newLevel) {
    this._data.level = parseInt(newLevel, 10) || this.userDefaultLevel.id;

    // Create new element and replace old one
    if (newLevel !== undefined && this._element.parentNode) {
      const newHeader = this._getElement();
      newHeader.innerHTML = this._element.innerHTML;
      this._element.parentNode.replaceChild(newHeader, this._element);
      this._element = newHeader;
    }
  }

  /**
   * Callback for Alignment block tune setting
   *
   * @param {string} newAlign
   */
  _setAlignType(newAlign) {
    this._data.align = newAlign;

    // Remove old CSS class and add new class
    Header.ALIGN_TYPES.forEach((align) => {
      const alignClass = this._CSS.wrapperForAlignment(align);
      this._element.classList.remove(alignClass);
      if (newAlign === align) {
        this._element.classList.add(alignClass);
      }
    });
  }

  /**
   * HTML element to render on the UI by Editor.js
   *
   * @returns {*}
   */
  render() {
    return this._element;
  }

  /**
   * Editor.js save method to extract block data from the UI
   *
   * @param {*} blockContent
   * @returns {{ text: string; level: number; align: string; }}
   */
  save(blockContent) {
    return {
      text: blockContent.innerHTML,
      level: this.currentLevel.id,
      align: this.currentAlignType,
    };
  }

  /**
   * Editor.js validation (on save) code for this block
   * - Skips empty blocks
   *
   * @param {*} savedData
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  validate(savedData) {
    return savedData.text.trim() !== '';
  }

  /**
   * Get formatted label for Block settings menu
   *
   * @param {string} name
   * @param {string} prefix
   * @returns {string}
   */
  _getFormattedLabel(name, prefix) {
    if (prefix) {
      return this._api.i18n.t(`${prefix}${name}`);
    }
    return this._api.i18n.t(name.charAt(0).toUpperCase() + name.slice(1));
  }

  /**
   * Create a Block menu setting
   *
   * @param {string} icon
   * @param {string} label
   * @param {*} onActivate
   * @param {boolean} isActive
   * @param {string} group
   * @returns {{ icon: string; label: string; onActivate: any; isActive: boolean; closeOnActivate: boolean; toggle: string; }}
   */
  _createSetting = (icon, label, onActivate, isActive, group) => ({
    icon,
    label,
    onActivate,
    isActive,
    closeOnActivate: true,
    toggle: group,
  });

  /**
   * Block Tunes Menu items
   *
   * @returns {[{*}]}
   */
  renderSettings() {
    const headerTypes = Header.HEADER_LEVELS.map((level) => 
      this._createSetting(
        level.icon, this._getFormattedLabel(level.id, 'Heading '), () => this._setHeaderLevel(level.id), 
        level.id === this.currentLevel.id, 'heading'
      )
    );

    const alignTypes = Header.ALIGN_TYPES.map((align) => 
      this._createSetting(
        getAlignmentIcon(align), this._getFormattedLabel(align), () => this._setAlignType(align), 
        align === this.currentAlignType, 'align'
      )
    );

    return [...headerTypes, ...alignTypes];
  }

  /**
   * Editor.js onPaste method to substitute pasted HTML
   * - Doesn't seem to work
   *
   * @param {*} event
   */
  onPaste(event) {
    const headerTag = event.detail.data;
    let level = this.currentLevel.id;

    switch (headerTag.tagName) {
      case 'H1':
        level = 1;
        break;
      case 'H2':
        level = 2;
        break;
      case 'H3':
        level = 3;
        break;
      case 'H4':
        level = 4;
        break;
      case 'H5':
        level = 5;
        break;
      case 'H6':
        level = 6;
        break;
      default:
        level = this.userDefaultLevel.id;
        break;
    }

    this._data = this._normalizeData({
      text: headerTag.innerHTML,
      level,
      align: this.currentAlignType,
    });

    this._element = this._getElement();
  }

  /**
   * Editor.js method to merge similar blocks on `Backspace` keypress
   *
   * @param {*} data
   */
  merge(data) {
    this._element.innerHTML = this._element.innerHTML + data.text || '';
  }
}
