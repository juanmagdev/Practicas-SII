import { Component, ContentChild, ContentChildren, Directive, EventEmitter, forwardRef, Inject, Input, Output, TemplateRef, } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbCollapse } from '../collapse/collapse';
import { isString } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "../collapse/collapse";
import * as i2 from "./accordion-config";
let nextId = 0;
/**
 * A directive that wraps the content of an accordion item's collapsible body.
 *
 * The actual content is provided in a child `ng-template` element.
 * Depending on the state of the accordion, the template will be either inserted or removed from the DOM.
 *
 * @since 14.1.0
 */
export class NgbAccordionBody {
    constructor(_item) {
        this._item = _item;
    }
    template() {
        return this._item.destroyOnHide === false || this._item.animatingBodyCollapse ? this._bodyTpl : null;
    }
}
NgbAccordionBody.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionBody, deps: [{ token: forwardRef(() => NgbAccordionItem) }], target: i0.ɵɵFactoryTarget.Component });
NgbAccordionBody.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionBody, isStandalone: true, selector: "[ngbAccordionBody]", host: { properties: { "class.accordion-body": "true" } }, queries: [{ propertyName: "_bodyTpl", first: true, predicate: TemplateRef, descendants: true, static: true }], ngImport: i0, template: `<ng-template [ngTemplateOutlet]="template()"></ng-template>`, isInline: true, dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionBody, decorators: [{
            type: Component,
            args: [{
                    selector: '[ngbAccordionBody]',
                    standalone: true,
                    imports: [NgTemplateOutlet],
                    host: { '[class.accordion-body]': 'true' },
                    template: `<ng-template [ngTemplateOutlet]="template()"></ng-template>`,
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionItem, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionItem)]
                }] }]; }, propDecorators: { _bodyTpl: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });
/**
 * A directive that wraps the collapsible item's content of the accordion.
 *
 * Internally it reuses the [`NgbCollapse` directive](#/components/collapse)
 *
 * @since 14.1.0
 */
export class NgbAccordionCollapse {
    constructor(item, ngbCollapse) {
        this.item = item;
        this.ngbCollapse = ngbCollapse;
    }
}
NgbAccordionCollapse.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionCollapse, deps: [{ token: forwardRef(() => NgbAccordionItem) }, { token: i1.NgbCollapse }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionCollapse.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionCollapse, isStandalone: true, selector: "[ngbAccordionCollapse]", host: { attributes: { "role": "region" }, properties: { "class.accordion-collapse": "true", "id": "item.collapseId", "attr.aria-labelledby": "item.toggleId" } }, exportAs: ["ngbAccordionCollapse"], hostDirectives: [{ directive: i1.NgbCollapse }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionCollapse, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngbAccordionCollapse',
                    standalone: true,
                    selector: '[ngbAccordionCollapse]',
                    host: {
                        role: 'region',
                        '[class.accordion-collapse]': 'true',
                        '[id]': 'item.collapseId',
                        '[attr.aria-labelledby]': 'item.toggleId',
                    },
                    hostDirectives: [
                        {
                            directive: NgbCollapse,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionItem, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionItem)]
                }] }, { type: i1.NgbCollapse }]; } });
/**
 * A directive to put on a toggling element inside the accordion item's header.
 * It will register click handlers that toggle the associated panel and will handle accessibility attributes.
 *
 * This directive is used internally by the [`NgbAccordionButton` directive](#/components/accordion/api#NgbAccordionButton).
 *
 * @since 14.1.0
 */
export class NgbAccordionToggle {
    constructor(item, accordion) {
        this.item = item;
        this.accordion = accordion;
    }
}
NgbAccordionToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionToggle, deps: [{ token: forwardRef(() => NgbAccordionItem) }, { token: forwardRef(() => NgbAccordionDirective) }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionToggle, isStandalone: true, selector: "[ngbAccordionToggle]", host: { listeners: { "click": "!item.disabled && accordion.toggle(item.id)" }, properties: { "id": "item.toggleId", "class.collapsed": "item.collapsed", "attr.aria-controls": "item.collapseId", "attr.aria-expanded": "!item.collapsed" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionToggle]',
                    standalone: true,
                    host: {
                        '[id]': 'item.toggleId',
                        '[class.collapsed]': 'item.collapsed',
                        '[attr.aria-controls]': 'item.collapseId',
                        '[attr.aria-expanded]': '!item.collapsed',
                        '(click)': '!item.disabled && accordion.toggle(item.id)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionItem, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionItem)]
                }] }, { type: NgbAccordionDirective, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionDirective)]
                }] }]; } });
/**
 * A directive to put on a button element inside an accordion item's header.
 *
 * If you want a custom markup for the header, you can also use the [`NgbAccordionToggle` directive](#/components/accordion/api#NgbAccordionToggle).
 *
 * @since 14.1.0
 */
export class NgbAccordionButton {
    constructor(item) {
        this.item = item;
    }
}
NgbAccordionButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionButton, deps: [{ token: forwardRef(() => NgbAccordionItem) }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionButton.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionButton, isStandalone: true, selector: "button[ngbAccordionButton]", host: { attributes: { "type": "button" }, properties: { "disabled": "item.disabled", "class.accordion-button": "true" } }, hostDirectives: [{ directive: NgbAccordionToggle }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionButton, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbAccordionButton]',
                    standalone: true,
                    host: {
                        '[disabled]': 'item.disabled',
                        '[class.accordion-button]': 'true',
                        type: 'button',
                    },
                    hostDirectives: [
                        {
                            directive: NgbAccordionToggle,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionItem, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionItem)]
                }] }]; } });
/**
 * A directive that wraps an accordion item's header.
 *
 * @since 14.1.0
 */
export class NgbAccordionHeader {
    constructor(item) {
        this.item = item;
    }
}
NgbAccordionHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionHeader, deps: [{ token: forwardRef(() => NgbAccordionItem) }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionHeader, isStandalone: true, selector: "[ngbAccordionHeader]", host: { attributes: { "role": "heading" }, properties: { "class.accordion-header": "true", "class.collapsed": "item.collapsed" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionHeader, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionHeader]',
                    standalone: true,
                    host: {
                        role: 'heading',
                        '[class.accordion-header]': 'true',
                        '[class.collapsed]': 'item.collapsed',
                    },
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionItem, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionItem)]
                }] }]; } });
/**
 * A directive that wraps an accordion item: a toggleable header + body that collapses.
 *
 * You can get hold of the `NgbAccordionItem` instance in the template with `#item="ngbAccordionItem"`.
 * It allows to check if the item is collapsed or not, toggle the collapse state, etc.
 *
 * Every accordion item has a string ID that is automatically generated in the `ngb-accordion-item-XX` format, unless provided explicitly.
 *
 * @since 14.1.0
 */
export class NgbAccordionItem {
    constructor(_accordion, _cd) {
        this._accordion = _accordion;
        this._cd = _cd;
        this._subscriptions = [];
        this._collapsed = true;
        this._id = `ngb-accordion-item-${nextId++}`;
        this.animatingBodyCollapse = false;
        /**
         * If `true`, the content of the accordion item's body will be removed from the DOM. It will be just hidden otherwise.
         *
         * This property can also be set up on the parent [`NgbAccordion` directive](#/components/accordion/api#NgbAccordionDirective).
         */
        this.destroyOnHide = this._accordion.destroyOnHide;
        /**
         * If `true`, the accordion item will be disabled.
         * It won't react to user's clicks, but still will be toggelable programmatically.
         */
        this.disabled = false;
        /**
         * Event emitted when the expanding animation is finished. It has no payload.
         */
        this.shown = new EventEmitter();
        /**
         * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
         * It has no payload.
         */
        this.hidden = new EventEmitter();
    }
    /**
     * Sets the custom ID of the accordion item. It must be unique for the document.
     *
     * @param id The ID of the accordion item, must be a non-empty string
     */
    set id(id) {
        if (isString(id) && id !== '') {
            this._id = id;
        }
    }
    /**
     *	If `true`, the accordion item will be collapsed. Otherwise, it will be expanded.
     *
     * @param collapsed New state of the accordion item.
     */
    set collapsed(collapsed) {
        if (this.collapsed !== collapsed) {
            this._collapsed = collapsed;
            this._cd.markForCheck(); // need if the accordion is used inside a component having OnPush change detection strategy
            // we need force CD to get template into DOM before starting animation to calculate its height correctly
            if (!this._collapsed) {
                this.animatingBodyCollapse = true;
                this._cd.detectChanges();
            }
            // we also need to make sure 'animation' flag is up-to- date
            this._collapse.ngbCollapse.animation = this._accordion.animation;
            this._collapse.ngbCollapse.collapsed = collapsed;
        }
    }
    get collapsed() {
        return this._collapsed;
    }
    get id() {
        return `${this._id}`;
    }
    get toggleId() {
        return `${this.id}-toggle`;
    }
    get collapseId() {
        return `${this.id}-collapse`;
    }
    ngAfterContentInit() {
        const { ngbCollapse } = this._collapse;
        // we need to disable the animation for the first init
        ngbCollapse.animation = false;
        ngbCollapse.collapsed = this.collapsed;
        // we set the animation to the default of the accordion
        ngbCollapse.animation = this._accordion.animation;
        // event forwarding from 'ngbCollapse' to 'ngbAccordion'
        this._subscriptions.push(ngbCollapse.hidden.subscribe(() => {
            // when the animation finishes we can remove the template from DOM
            this.animatingBodyCollapse = false;
            this.hidden.emit();
            this._accordion.hidden.emit(this.id);
        }), ngbCollapse.shown.subscribe(() => {
            this.shown.emit();
            this._accordion.shown.emit(this.id);
        }));
    }
    ngOnDestroy() {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }
    /**
     * Toggles an accordion item.
     */
    toggle() {
        this.collapsed = !this.collapsed;
    }
}
NgbAccordionItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionItem, deps: [{ token: forwardRef(() => NgbAccordionDirective) }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionItem, isStandalone: true, selector: "[ngbAccordionItem]", inputs: { id: ["ngbAccordionItem", "id"], destroyOnHide: "destroyOnHide", disabled: "disabled", collapsed: "collapsed" }, outputs: { shown: "shown", hidden: "hidden" }, host: { properties: { "class.accordion-item": "true", "id": "id" } }, queries: [{ propertyName: "_collapse", first: true, predicate: NgbAccordionCollapse, descendants: true, static: true }], exportAs: ["ngbAccordionItem"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbAccordionItem]',
                    exportAs: 'ngbAccordionItem',
                    standalone: true,
                    host: {
                        '[class.accordion-item]': 'true',
                        '[id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionDirective, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordionDirective)]
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { _collapse: [{
                type: ContentChild,
                args: [NgbAccordionCollapse, { static: true }]
            }], id: [{
                type: Input,
                args: ['ngbAccordionItem']
            }], destroyOnHide: [{
                type: Input
            }], disabled: [{
                type: Input
            }], collapsed: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
/**
 * Accordion is a stack of cards that have a header and collapsible body.
 *
 * This directive is a container for these items and provides an API to handle them.
 *
 * @since 14.1.0
 */
export class NgbAccordionDirective {
    constructor(config) {
        /**
         * If `true`, the content of the accordion items body will be removed from the DOM. It will be just hidden otherwise.
         *
         * This property can be overwritten at the [`NgbAccordionItem`](#/components/accordion/api#NgbAccordionItem) level
         */
        this.destroyOnHide = true;
        /**
         * Event emitted when the expanding animation is finished. The payload is the id of shown accordion item.
         */
        this.shown = new EventEmitter();
        /**
         * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
         * The payload is the id of hidden accordion item.
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
        this.closeOthers = config.closeOthers;
    }
    /**
     * Toggles an item with the given id.
     *
     * It will toggle an item, even if it is disabled.
     *
     * @param itemId The id of the item to toggle.
     */
    toggle(itemId) {
        const toToggle = this._getItem(itemId);
        if (toToggle) {
            const oldStateCollapsed = toToggle.collapsed;
            this._items.forEach((item) => {
                if (item === toToggle) {
                    item.toggle();
                }
                else if (this.closeOthers && oldStateCollapsed) {
                    // collapse other items if the selected item was collapsed and it will be open
                    item.collapsed = true;
                }
            });
        }
    }
    /**
     * Expands an item with the given id.
     *
     * If `closeOthers` is `true`, it will collapse other panels.
     *
     * @param itemId The id of the item to expand.
     */
    expand(itemId) {
        const toExpand = this._getItem(itemId);
        if (toExpand) {
            this._items.forEach((item) => {
                if (item === toExpand) {
                    toExpand.collapsed = false;
                }
                else if (this.closeOthers) {
                    item.collapsed = true;
                }
            });
        }
    }
    /**
     * Expands all items.
     *
     * If `closeOthers` is `true` and all items are closed, it will open the first one. Otherwise, it will keep the opened one.
     */
    expandAll() {
        if (this.closeOthers) {
            // we check if there is an item open and if it is not we can expand the first item
            // (otherwise we toggle nothing)
            if (!this._items.find((item) => !item.collapsed)) {
                this._items.get(0).collapsed = false;
            }
        }
        else {
            this._items.forEach((item) => {
                item.collapsed = false;
            });
        }
    }
    /**
     * Collapses an item with the given id.
     *
     * Has no effect if the `itemId` does not correspond to any item.
     *
     * @param itemId The id of the item to collapse.
     */
    collapse(itemId) {
        const toCollapse = this._getItem(itemId);
        if (toCollapse) {
            toCollapse.collapsed = true;
        }
    }
    /**
     * Collapses all items.
     */
    collapseAll() {
        this._items.forEach((item) => (item.collapsed = true));
    }
    /**
     * Checks if an item with the given id is expanded.
     *
     * If the `itemId` does not correspond to any item, it returns `false`.
     *
     * @param itemId The id of the item to check.
     */
    isExpanded(itemId) {
        const item = this._getItem(itemId);
        return item ? !item.collapsed : false;
    }
    _getItem(itemId) {
        return this._items.find((item) => item.id === itemId);
    }
}
NgbAccordionDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionDirective, deps: [{ token: i2.NgbAccordionConfig }], target: i0.ɵɵFactoryTarget.Directive });
NgbAccordionDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordionDirective, isStandalone: true, selector: "[ngbAccordion]", inputs: { animation: "animation", closeOthers: "closeOthers", destroyOnHide: "destroyOnHide" }, outputs: { shown: "shown", hidden: "hidden" }, host: { properties: { "class.accordion": "true" } }, queries: [{ propertyName: "_items", predicate: NgbAccordionItem }], exportAs: ["ngbAccordion"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngbAccordion',
                    standalone: true,
                    selector: '[ngbAccordion]',
                    host: { '[class.accordion]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i2.NgbAccordionConfig }]; }, propDecorators: { _items: [{
                type: ContentChildren,
                args: [NgbAccordionItem, { descendants: false }]
            }], animation: [{
                type: Input
            }], closeOthers: [{
                type: Input
            }], destroyOnHide: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR04sU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFFTCxNQUFNLEVBRU4sV0FBVyxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7O0FBRXhDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmOzs7Ozs7O0dBT0c7QUFRSCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzVCLFlBQWdFLEtBQXVCO1FBQXZCLFVBQUssR0FBTCxLQUFLLENBQWtCO0lBQUcsQ0FBQztJQUkzRixRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RHLENBQUM7OzZHQVBXLGdCQUFnQixrQkFDUixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7aUdBRDFDLGdCQUFnQiw4S0FHZCxXQUFXLDhEQUxmLDZEQUE2RCw0REFGN0QsZ0JBQWdCOzJGQUlkLGdCQUFnQjtrQkFQNUIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsZ0JBQWdC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R0FFbUUsTUFBTTtzQkFBeEUsZUFBZTt1QkFBQyxnQkFBZ0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUU7Z0JBSWhELFNBQVM7c0JBQWpCLEtBQUs7Z0JBS0csV0FBVztzQkFBbkIsS0FBSztnQkFPRyxhQUFhO3NCQUFyQixLQUFLO2dCQUtJLEtBQUs7c0JBQWQsTUFBTTtnQkFNRyxNQUFNO3NCQUFmLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBZnRlckNvbnRlbnRJbml0LFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50LFxuXHRDb250ZW50Q2hpbGQsXG5cdENvbnRlbnRDaGlsZHJlbixcblx0RGlyZWN0aXZlLFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEluamVjdCxcblx0SW5wdXQsXG5cdE9uRGVzdHJveSxcblx0T3V0cHV0LFxuXHRRdWVyeUxpc3QsXG5cdFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmdiQWNjb3JkaW9uQ29uZmlnIH0gZnJvbSAnLi9hY2NvcmRpb24tY29uZmlnJztcbmltcG9ydCB7IE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdiQ29sbGFwc2UgfSBmcm9tICcuLi9jb2xsYXBzZS9jb2xsYXBzZSc7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgdGhlIGNvbnRlbnQgb2YgYW4gYWNjb3JkaW9uIGl0ZW0ncyBjb2xsYXBzaWJsZSBib2R5LlxuICpcbiAqIFRoZSBhY3R1YWwgY29udGVudCBpcyBwcm92aWRlZCBpbiBhIGNoaWxkIGBuZy10ZW1wbGF0ZWAgZWxlbWVudC5cbiAqIERlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgdGhlIGFjY29yZGlvbiwgdGhlIHRlbXBsYXRlIHdpbGwgYmUgZWl0aGVyIGluc2VydGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbkJvZHldJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aW1wb3J0czogW05nVGVtcGxhdGVPdXRsZXRdLFxuXHRob3N0OiB7ICdbY2xhc3MuYWNjb3JkaW9uLWJvZHldJzogJ3RydWUnIH0sXG5cdHRlbXBsYXRlOiBgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlKClcIj48L25nLXRlbXBsYXRlPmAsXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbkJvZHkge1xuXHRjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiQWNjb3JkaW9uSXRlbSkpIHByaXZhdGUgX2l0ZW06IE5nYkFjY29yZGlvbkl0ZW0pIHt9XG5cblx0QENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBfYm9keVRwbDogVGVtcGxhdGVSZWY8YW55PjtcblxuXHR0ZW1wbGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5faXRlbS5kZXN0cm95T25IaWRlID09PSBmYWxzZSB8fCB0aGlzLl9pdGVtLmFuaW1hdGluZ0JvZHlDb2xsYXBzZSA/IHRoaXMuX2JvZHlUcGwgOiBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyB0aGUgY29sbGFwc2libGUgaXRlbSdzIGNvbnRlbnQgb2YgdGhlIGFjY29yZGlvbi5cbiAqXG4gKiBJbnRlcm5hbGx5IGl0IHJldXNlcyB0aGUgW2BOZ2JDb2xsYXBzZWAgZGlyZWN0aXZlXSgjL2NvbXBvbmVudHMvY29sbGFwc2UpXG4gKlxuICogQHNpbmNlIDE0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0ZXhwb3J0QXM6ICduZ2JBY2NvcmRpb25Db2xsYXBzZScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbkNvbGxhcHNlXScsXG5cdGhvc3Q6IHtcblx0XHRyb2xlOiAncmVnaW9uJyxcblx0XHQnW2NsYXNzLmFjY29yZGlvbi1jb2xsYXBzZV0nOiAndHJ1ZScsXG5cdFx0J1tpZF0nOiAnaXRlbS5jb2xsYXBzZUlkJyxcblx0XHQnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdpdGVtLnRvZ2dsZUlkJyxcblx0fSxcblx0aG9zdERpcmVjdGl2ZXM6IFtcblx0XHR7XG5cdFx0XHRkaXJlY3RpdmU6IE5nYkNvbGxhcHNlLFxuXHRcdH0sXG5cdF0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbkNvbGxhcHNlIHtcblx0Y29uc3RydWN0b3IoXG5cdFx0QEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkFjY29yZGlvbkl0ZW0pKSBwdWJsaWMgaXRlbTogTmdiQWNjb3JkaW9uSXRlbSxcblx0XHRwdWJsaWMgbmdiQ29sbGFwc2U6IE5nYkNvbGxhcHNlLFxuXHQpIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gcHV0IG9uIGEgdG9nZ2xpbmcgZWxlbWVudCBpbnNpZGUgdGhlIGFjY29yZGlvbiBpdGVtJ3MgaGVhZGVyLlxuICogSXQgd2lsbCByZWdpc3RlciBjbGljayBoYW5kbGVycyB0aGF0IHRvZ2dsZSB0aGUgYXNzb2NpYXRlZCBwYW5lbCBhbmQgd2lsbCBoYW5kbGUgYWNjZXNzaWJpbGl0eSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgW2BOZ2JBY2NvcmRpb25CdXR0b25gIGRpcmVjdGl2ZV0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiQWNjb3JkaW9uQnV0dG9uKS5cbiAqXG4gKiBAc2luY2UgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JBY2NvcmRpb25Ub2dnbGVdJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbaWRdJzogJ2l0ZW0udG9nZ2xlSWQnLFxuXHRcdCdbY2xhc3MuY29sbGFwc2VkXSc6ICdpdGVtLmNvbGxhcHNlZCcsXG5cdFx0J1thdHRyLmFyaWEtY29udHJvbHNdJzogJ2l0ZW0uY29sbGFwc2VJZCcsXG5cdFx0J1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJyFpdGVtLmNvbGxhcHNlZCcsXG5cdFx0JyhjbGljayknOiAnIWl0ZW0uZGlzYWJsZWQgJiYgYWNjb3JkaW9uLnRvZ2dsZShpdGVtLmlkKScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvblRvZ2dsZSB7XG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JBY2NvcmRpb25JdGVtKSkgcHVibGljIGl0ZW06IE5nYkFjY29yZGlvbkl0ZW0sXG5cdFx0QEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkFjY29yZGlvbkRpcmVjdGl2ZSkpIHB1YmxpYyBhY2NvcmRpb246IE5nYkFjY29yZGlvbkRpcmVjdGl2ZSxcblx0KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHB1dCBvbiBhIGJ1dHRvbiBlbGVtZW50IGluc2lkZSBhbiBhY2NvcmRpb24gaXRlbSdzIGhlYWRlci5cbiAqXG4gKiBJZiB5b3Ugd2FudCBhIGN1c3RvbSBtYXJrdXAgZm9yIHRoZSBoZWFkZXIsIHlvdSBjYW4gYWxzbyB1c2UgdGhlIFtgTmdiQWNjb3JkaW9uVG9nZ2xlYCBkaXJlY3RpdmVdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYkFjY29yZGlvblRvZ2dsZSkuXG4gKlxuICogQHNpbmNlIDE0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdidXR0b25bbmdiQWNjb3JkaW9uQnV0dG9uXScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHQnW2Rpc2FibGVkXSc6ICdpdGVtLmRpc2FibGVkJyxcblx0XHQnW2NsYXNzLmFjY29yZGlvbi1idXR0b25dJzogJ3RydWUnLFxuXHRcdHR5cGU6ICdidXR0b24nLFxuXHR9LFxuXHRob3N0RGlyZWN0aXZlczogW1xuXHRcdHtcblx0XHRcdGRpcmVjdGl2ZTogTmdiQWNjb3JkaW9uVG9nZ2xlLFxuXHRcdH0sXG5cdF0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbkJ1dHRvbiB7XG5cdGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JBY2NvcmRpb25JdGVtKSkgcHVibGljIGl0ZW06IE5nYkFjY29yZGlvbkl0ZW0pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyBhbiBhY2NvcmRpb24gaXRlbSdzIGhlYWRlci5cbiAqXG4gKiBAc2luY2UgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ1tuZ2JBY2NvcmRpb25IZWFkZXJdJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdHJvbGU6ICdoZWFkaW5nJyxcblx0XHQnW2NsYXNzLmFjY29yZGlvbi1oZWFkZXJdJzogJ3RydWUnLFxuXHRcdCdbY2xhc3MuY29sbGFwc2VkXSc6ICdpdGVtLmNvbGxhcHNlZCcsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbkhlYWRlciB7XG5cdGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JBY2NvcmRpb25JdGVtKSkgcHVibGljIGl0ZW06IE5nYkFjY29yZGlvbkl0ZW0pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyBhbiBhY2NvcmRpb24gaXRlbTogYSB0b2dnbGVhYmxlIGhlYWRlciArIGJvZHkgdGhhdCBjb2xsYXBzZXMuXG4gKlxuICogWW91IGNhbiBnZXQgaG9sZCBvZiB0aGUgYE5nYkFjY29yZGlvbkl0ZW1gIGluc3RhbmNlIGluIHRoZSB0ZW1wbGF0ZSB3aXRoIGAjaXRlbT1cIm5nYkFjY29yZGlvbkl0ZW1cImAuXG4gKiBJdCBhbGxvd3MgdG8gY2hlY2sgaWYgdGhlIGl0ZW0gaXMgY29sbGFwc2VkIG9yIG5vdCwgdG9nZ2xlIHRoZSBjb2xsYXBzZSBzdGF0ZSwgZXRjLlxuICpcbiAqIEV2ZXJ5IGFjY29yZGlvbiBpdGVtIGhhcyBhIHN0cmluZyBJRCB0aGF0IGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGluIHRoZSBgbmdiLWFjY29yZGlvbi1pdGVtLVhYYCBmb3JtYXQsIHVubGVzcyBwcm92aWRlZCBleHBsaWNpdGx5LlxuICpcbiAqIEBzaW5jZSAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbkl0ZW1dJyxcblx0ZXhwb3J0QXM6ICduZ2JBY2NvcmRpb25JdGVtJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3MuYWNjb3JkaW9uLWl0ZW1dJzogJ3RydWUnLFxuXHRcdCdbaWRdJzogJ2lkJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uSXRlbSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JBY2NvcmRpb25EaXJlY3RpdmUpKSBwcml2YXRlIF9hY2NvcmRpb246IE5nYkFjY29yZGlvbkRpcmVjdGl2ZSxcblx0XHRwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdCkge31cblxuXHRwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXHRwcml2YXRlIF9jb2xsYXBzZWQgPSB0cnVlO1xuXHRwcml2YXRlIF9pZCA9IGBuZ2ItYWNjb3JkaW9uLWl0ZW0tJHtuZXh0SWQrK31gO1xuXG5cdGFuaW1hdGluZ0JvZHlDb2xsYXBzZSA9IGZhbHNlO1xuXG5cdEBDb250ZW50Q2hpbGQoTmdiQWNjb3JkaW9uQ29sbGFwc2UsIHsgc3RhdGljOiB0cnVlIH0pIHByaXZhdGUgX2NvbGxhcHNlOiBOZ2JBY2NvcmRpb25Db2xsYXBzZTtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgY3VzdG9tIElEIG9mIHRoZSBhY2NvcmRpb24gaXRlbS4gSXQgbXVzdCBiZSB1bmlxdWUgZm9yIHRoZSBkb2N1bWVudC5cblx0ICpcblx0ICogQHBhcmFtIGlkIFRoZSBJRCBvZiB0aGUgYWNjb3JkaW9uIGl0ZW0sIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nXG5cdCAqL1xuXHRASW5wdXQoJ25nYkFjY29yZGlvbkl0ZW0nKSBzZXQgaWQoaWQ6IHN0cmluZykge1xuXHRcdGlmIChpc1N0cmluZyhpZCkgJiYgaWQgIT09ICcnKSB7XG5cdFx0XHR0aGlzLl9pZCA9IGlkO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSBjb250ZW50IG9mIHRoZSBhY2NvcmRpb24gaXRlbSdzIGJvZHkgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIERPTS4gSXQgd2lsbCBiZSBqdXN0IGhpZGRlbiBvdGhlcndpc2UuXG5cdCAqXG5cdCAqIFRoaXMgcHJvcGVydHkgY2FuIGFsc28gYmUgc2V0IHVwIG9uIHRoZSBwYXJlbnQgW2BOZ2JBY2NvcmRpb25gIGRpcmVjdGl2ZV0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiQWNjb3JkaW9uRGlyZWN0aXZlKS5cblx0ICovXG5cdEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGUgPSB0aGlzLl9hY2NvcmRpb24uZGVzdHJveU9uSGlkZTtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB0aGUgYWNjb3JkaW9uIGl0ZW0gd2lsbCBiZSBkaXNhYmxlZC5cblx0ICogSXQgd29uJ3QgcmVhY3QgdG8gdXNlcidzIGNsaWNrcywgYnV0IHN0aWxsIHdpbGwgYmUgdG9nZ2VsYWJsZSBwcm9ncmFtbWF0aWNhbGx5LlxuXHQgKi9cblx0QElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuXHQvKipcblx0ICpcdElmIGB0cnVlYCwgdGhlIGFjY29yZGlvbiBpdGVtIHdpbGwgYmUgY29sbGFwc2VkLiBPdGhlcndpc2UsIGl0IHdpbGwgYmUgZXhwYW5kZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBjb2xsYXBzZWQgTmV3IHN0YXRlIG9mIHRoZSBhY2NvcmRpb24gaXRlbS5cblx0ICovXG5cdEBJbnB1dCgpIHNldCBjb2xsYXBzZWQoY29sbGFwc2VkOiBib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuY29sbGFwc2VkICE9PSBjb2xsYXBzZWQpIHtcblx0XHRcdHRoaXMuX2NvbGxhcHNlZCA9IGNvbGxhcHNlZDtcblx0XHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpOyAvLyBuZWVkIGlmIHRoZSBhY2NvcmRpb24gaXMgdXNlZCBpbnNpZGUgYSBjb21wb25lbnQgaGF2aW5nIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uIHN0cmF0ZWd5XG5cdFx0XHQvLyB3ZSBuZWVkIGZvcmNlIENEIHRvIGdldCB0ZW1wbGF0ZSBpbnRvIERPTSBiZWZvcmUgc3RhcnRpbmcgYW5pbWF0aW9uIHRvIGNhbGN1bGF0ZSBpdHMgaGVpZ2h0IGNvcnJlY3RseVxuXHRcdFx0aWYgKCF0aGlzLl9jb2xsYXBzZWQpIHtcblx0XHRcdFx0dGhpcy5hbmltYXRpbmdCb2R5Q29sbGFwc2UgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG5cdFx0XHR9XG5cdFx0XHQvLyB3ZSBhbHNvIG5lZWQgdG8gbWFrZSBzdXJlICdhbmltYXRpb24nIGZsYWcgaXMgdXAtdG8tIGRhdGVcblx0XHRcdHRoaXMuX2NvbGxhcHNlLm5nYkNvbGxhcHNlLmFuaW1hdGlvbiA9IHRoaXMuX2FjY29yZGlvbi5hbmltYXRpb247XG5cdFx0XHR0aGlzLl9jb2xsYXBzZS5uZ2JDb2xsYXBzZS5jb2xsYXBzZWQgPSBjb2xsYXBzZWQ7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZXhwYW5kaW5nIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC4gSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0LyoqXG5cdCAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY29sbGFwc2luZyBhbmltYXRpb24gaXMgZmluaXNoZWQgYW5kIGJlZm9yZSB0aGUgY29udGVudCBpcyByZW1vdmVkIGZyb20gRE9NLlxuXHQgKiBJdCBoYXMgbm8gcGF5bG9hZC5cblx0ICovXG5cdEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0Z2V0IGNvbGxhcHNlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29sbGFwc2VkO1xuXHR9XG5cblx0Z2V0IGlkKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLl9pZH1gO1xuXHR9XG5cblx0Z2V0IHRvZ2dsZUlkKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLmlkfS10b2dnbGVgO1xuXHR9XG5cblx0Z2V0IGNvbGxhcHNlSWQoKSB7XG5cdFx0cmV0dXJuIGAke3RoaXMuaWR9LWNvbGxhcHNlYDtcblx0fVxuXG5cdG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcblx0XHRjb25zdCB7IG5nYkNvbGxhcHNlIH0gPSB0aGlzLl9jb2xsYXBzZTtcblx0XHQvLyB3ZSBuZWVkIHRvIGRpc2FibGUgdGhlIGFuaW1hdGlvbiBmb3IgdGhlIGZpcnN0IGluaXRcblx0XHRuZ2JDb2xsYXBzZS5hbmltYXRpb24gPSBmYWxzZTtcblx0XHRuZ2JDb2xsYXBzZS5jb2xsYXBzZWQgPSB0aGlzLmNvbGxhcHNlZDtcblx0XHQvLyB3ZSBzZXQgdGhlIGFuaW1hdGlvbiB0byB0aGUgZGVmYXVsdCBvZiB0aGUgYWNjb3JkaW9uXG5cdFx0bmdiQ29sbGFwc2UuYW5pbWF0aW9uID0gdGhpcy5fYWNjb3JkaW9uLmFuaW1hdGlvbjtcblx0XHQvLyBldmVudCBmb3J3YXJkaW5nIGZyb20gJ25nYkNvbGxhcHNlJyB0byAnbmdiQWNjb3JkaW9uJ1xuXHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcblx0XHRcdG5nYkNvbGxhcHNlLmhpZGRlbi5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHQvLyB3aGVuIHRoZSBhbmltYXRpb24gZmluaXNoZXMgd2UgY2FuIHJlbW92ZSB0aGUgdGVtcGxhdGUgZnJvbSBET01cblx0XHRcdFx0dGhpcy5hbmltYXRpbmdCb2R5Q29sbGFwc2UgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5oaWRkZW4uZW1pdCgpO1xuXHRcdFx0XHR0aGlzLl9hY2NvcmRpb24uaGlkZGVuLmVtaXQodGhpcy5pZCk7XG5cdFx0XHR9KSxcblx0XHRcdG5nYkNvbGxhcHNlLnNob3duLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2hvd24uZW1pdCgpO1xuXHRcdFx0XHR0aGlzLl9hY2NvcmRpb24uc2hvd24uZW1pdCh0aGlzLmlkKTtcblx0XHRcdH0pLFxuXHRcdCk7XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpIHtcblx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBhbiBhY2NvcmRpb24gaXRlbS5cblx0ICovXG5cdHRvZ2dsZSgpIHtcblx0XHR0aGlzLmNvbGxhcHNlZCA9ICF0aGlzLmNvbGxhcHNlZDtcblx0fVxufVxuXG4vKipcbiAqIEFjY29yZGlvbiBpcyBhIHN0YWNrIG9mIGNhcmRzIHRoYXQgaGF2ZSBhIGhlYWRlciBhbmQgY29sbGFwc2libGUgYm9keS5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBhIGNvbnRhaW5lciBmb3IgdGhlc2UgaXRlbXMgYW5kIHByb3ZpZGVzIGFuIEFQSSB0byBoYW5kbGUgdGhlbS5cbiAqXG4gKiBAc2luY2UgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRleHBvcnRBczogJ25nYkFjY29yZGlvbicsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdHNlbGVjdG9yOiAnW25nYkFjY29yZGlvbl0nLFxuXHRob3N0OiB7ICdbY2xhc3MuYWNjb3JkaW9uXSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBY2NvcmRpb25EaXJlY3RpdmUge1xuXHRAQ29udGVudENoaWxkcmVuKE5nYkFjY29yZGlvbkl0ZW0sIHsgZGVzY2VuZGFudHM6IGZhbHNlIH0pIHByaXZhdGUgX2l0ZW1zOiBRdWVyeUxpc3Q8TmdiQWNjb3JkaW9uSXRlbT47XG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIGFjY29yZGlvbiB3aWxsIGJlIGFuaW1hdGVkLlxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIG9ubHkgb25lIGl0ZW0gYXQgdGhlIHRpbWUgY2FuIHN0YXkgb3Blbi5cblx0ICovXG5cdEBJbnB1dCgpIGNsb3NlT3RoZXJzOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRoZSBjb250ZW50IG9mIHRoZSBhY2NvcmRpb24gaXRlbXMgYm9keSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NLiBJdCB3aWxsIGJlIGp1c3QgaGlkZGVuIG90aGVyd2lzZS5cblx0ICpcblx0ICogVGhpcyBwcm9wZXJ0eSBjYW4gYmUgb3ZlcndyaXR0ZW4gYXQgdGhlIFtgTmdiQWNjb3JkaW9uSXRlbWBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYkFjY29yZGlvbkl0ZW0pIGxldmVsXG5cdCAqL1xuXHRASW5wdXQoKSBkZXN0cm95T25IaWRlID0gdHJ1ZTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBleHBhbmRpbmcgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBUaGUgcGF5bG9hZCBpcyB0aGUgaWQgb2Ygc2hvd24gYWNjb3JkaW9uIGl0ZW0uXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuXHQvKipcblx0ICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzaW5nIGFuaW1hdGlvbiBpcyBmaW5pc2hlZCBhbmQgYmVmb3JlIHRoZSBjb250ZW50IGlzIHJlbW92ZWQgZnJvbSBET00uXG5cdCAqIFRoZSBwYXlsb2FkIGlzIHRoZSBpZCBvZiBoaWRkZW4gYWNjb3JkaW9uIGl0ZW0uXG5cdCAqL1xuXHRAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cblx0Y29uc3RydWN0b3IoY29uZmlnOiBOZ2JBY2NvcmRpb25Db25maWcpIHtcblx0XHR0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG5cdFx0dGhpcy5jbG9zZU90aGVycyA9IGNvbmZpZy5jbG9zZU90aGVycztcblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQuXG5cdCAqXG5cdCAqIEl0IHdpbGwgdG9nZ2xlIGFuIGl0ZW0sIGV2ZW4gaWYgaXQgaXMgZGlzYWJsZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtSWQgVGhlIGlkIG9mIHRoZSBpdGVtIHRvIHRvZ2dsZS5cblx0ICovXG5cdHRvZ2dsZShpdGVtSWQ6IHN0cmluZykge1xuXHRcdGNvbnN0IHRvVG9nZ2xlID0gdGhpcy5fZ2V0SXRlbShpdGVtSWQpO1xuXHRcdGlmICh0b1RvZ2dsZSkge1xuXHRcdFx0Y29uc3Qgb2xkU3RhdGVDb2xsYXBzZWQgPSB0b1RvZ2dsZS5jb2xsYXBzZWQ7XG5cdFx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGlmIChpdGVtID09PSB0b1RvZ2dsZSkge1xuXHRcdFx0XHRcdGl0ZW0udG9nZ2xlKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5jbG9zZU90aGVycyAmJiBvbGRTdGF0ZUNvbGxhcHNlZCkge1xuXHRcdFx0XHRcdC8vIGNvbGxhcHNlIG90aGVyIGl0ZW1zIGlmIHRoZSBzZWxlY3RlZCBpdGVtIHdhcyBjb2xsYXBzZWQgYW5kIGl0IHdpbGwgYmUgb3BlblxuXHRcdFx0XHRcdGl0ZW0uY29sbGFwc2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV4cGFuZHMgYW4gaXRlbSB3aXRoIHRoZSBnaXZlbiBpZC5cblx0ICpcblx0ICogSWYgYGNsb3NlT3RoZXJzYCBpcyBgdHJ1ZWAsIGl0IHdpbGwgY29sbGFwc2Ugb3RoZXIgcGFuZWxzLlxuXHQgKlxuXHQgKiBAcGFyYW0gaXRlbUlkIFRoZSBpZCBvZiB0aGUgaXRlbSB0byBleHBhbmQuXG5cdCAqL1xuXHRleHBhbmQoaXRlbUlkOiBzdHJpbmcpIHtcblx0XHRjb25zdCB0b0V4cGFuZCA9IHRoaXMuX2dldEl0ZW0oaXRlbUlkKTtcblx0XHRpZiAodG9FeHBhbmQpIHtcblx0XHRcdHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0aWYgKGl0ZW0gPT09IHRvRXhwYW5kKSB7XG5cdFx0XHRcdFx0dG9FeHBhbmQuY29sbGFwc2VkID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5jbG9zZU90aGVycykge1xuXHRcdFx0XHRcdGl0ZW0uY29sbGFwc2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEV4cGFuZHMgYWxsIGl0ZW1zLlxuXHQgKlxuXHQgKiBJZiBgY2xvc2VPdGhlcnNgIGlzIGB0cnVlYCBhbmQgYWxsIGl0ZW1zIGFyZSBjbG9zZWQsIGl0IHdpbGwgb3BlbiB0aGUgZmlyc3Qgb25lLiBPdGhlcndpc2UsIGl0IHdpbGwga2VlcCB0aGUgb3BlbmVkIG9uZS5cblx0ICovXG5cdGV4cGFuZEFsbCgpIHtcblx0XHRpZiAodGhpcy5jbG9zZU90aGVycykge1xuXHRcdFx0Ly8gd2UgY2hlY2sgaWYgdGhlcmUgaXMgYW4gaXRlbSBvcGVuIGFuZCBpZiBpdCBpcyBub3Qgd2UgY2FuIGV4cGFuZCB0aGUgZmlyc3QgaXRlbVxuXHRcdFx0Ly8gKG90aGVyd2lzZSB3ZSB0b2dnbGUgbm90aGluZylcblx0XHRcdGlmICghdGhpcy5faXRlbXMuZmluZCgoaXRlbSkgPT4gIWl0ZW0uY29sbGFwc2VkKSkge1xuXHRcdFx0XHR0aGlzLl9pdGVtcy5nZXQoMCkhLmNvbGxhcHNlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGl0ZW0uY29sbGFwc2VkID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ29sbGFwc2VzIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQuXG5cdCAqXG5cdCAqIEhhcyBubyBlZmZlY3QgaWYgdGhlIGBpdGVtSWRgIGRvZXMgbm90IGNvcnJlc3BvbmQgdG8gYW55IGl0ZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtSWQgVGhlIGlkIG9mIHRoZSBpdGVtIHRvIGNvbGxhcHNlLlxuXHQgKi9cblx0Y29sbGFwc2UoaXRlbUlkOiBzdHJpbmcpIHtcblx0XHRjb25zdCB0b0NvbGxhcHNlID0gdGhpcy5fZ2V0SXRlbShpdGVtSWQpO1xuXHRcdGlmICh0b0NvbGxhcHNlKSB7XG5cdFx0XHR0b0NvbGxhcHNlLmNvbGxhcHNlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbGxhcHNlcyBhbGwgaXRlbXMuXG5cdCAqL1xuXHRjb2xsYXBzZUFsbCgpIHtcblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiAoaXRlbS5jb2xsYXBzZWQgPSB0cnVlKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIGFuIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gaWQgaXMgZXhwYW5kZWQuXG5cdCAqXG5cdCAqIElmIHRoZSBgaXRlbUlkYCBkb2VzIG5vdCBjb3JyZXNwb25kIHRvIGFueSBpdGVtLCBpdCByZXR1cm5zIGBmYWxzZWAuXG5cdCAqXG5cdCAqIEBwYXJhbSBpdGVtSWQgVGhlIGlkIG9mIHRoZSBpdGVtIHRvIGNoZWNrLlxuXHQgKi9cblx0aXNFeHBhbmRlZChpdGVtSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLl9nZXRJdGVtKGl0ZW1JZCk7XG5cdFx0cmV0dXJuIGl0ZW0gPyAhaXRlbS5jb2xsYXBzZWQgOiBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgX2dldEl0ZW0oaXRlbUlkOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy5faXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gaXRlbUlkKTtcblx0fVxufVxuIl19