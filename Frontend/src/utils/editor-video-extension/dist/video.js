"use strict";
exports.__esModule = true;
exports.Video = exports.inputRegex = void 0;
var core_1 = require("@tiptap/core");
exports.inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))/;
exports.Video = core_1.Node.create({
    name: 'video',
    addOptions: function () {
        return {
            inline: false,
            HTMLAttributes: {}
        };
    },
    inline: function () {
        return this.options.inline;
    },
    group: function () {
        return this.options.inline ? 'inline' : 'block';
    },
    draggable: true,
    addAttributes: function () {
        return {
            src: {
                "default": null
            },
            type: {
                "default": null
            },
            controls: {
                "default": true
            }
        };
    },
    parseHTML: function () {
        return [
            {
                tag: 'video[src]'
            },
        ];
    },
    renderHTML: function (_a) {
        var HTMLAttributes = _a.HTMLAttributes;
        return ['video', (0, core_1.mergeAttributes)(this.options.HTMLAttributes, HTMLAttributes)];
    },
    addCommands: function () {
        var _this = this;
        return {
            setVideo: function (options) { return function (_a) {
                var commands = _a.commands;
                return commands.insertContent({
                    type: _this.name,
                    attrs: options
                });
            }; }
        };
    },
    addInputRules: function () {
        return [
            (0, core_1.nodeInputRule)({
                find: exports.inputRegex,
                type: this.type,
                getAttributes: function (match) {
                    var type = match[2], src = match[3], controls = match[4];
                    return { src: src, type: type, controls: controls };
                }
            }),
        ];
    }
});
