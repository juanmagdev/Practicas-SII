import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Inject, Input, Output, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "./tooltip-config";
let nextId = 0;
export class NgbTooltipWindow {
}
NgbTooltipWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTooltipWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbTooltipWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbTooltipWindow, isStandalone: true, selector: "ngb-tooltip-window", inputs: { animation: "animation", id: "id", tooltipClass: "tooltipClass" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"tooltip\" + (tooltipClass ? \" \" + tooltipClass : \"\")", "class.fade": "animation", "id": "id" } }, ngImport: i0, template: `<div class="tooltip-arrow" data-popper-arrow></div
		><div class="tooltip-inner"><ng-content></ng-content></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTooltipWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-tooltip-window',
                    standalone: true,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
                        '[class.fade]': 'animation',
                        role: 'tooltip',
                        '[id]': 'id',
                    },
                    template: `<div class="tooltip-arrow" data-popper-arrow></div
		><div class="tooltip-inner"><ng-content></ng-content></div>`,
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], id: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
export class NgbTooltip {
    constructor(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, _document, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        this._changeDetector = _changeDetector;
        /**
         * An event emitted when the tooltip opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the tooltip closing animation has finished. Contains no payload.
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
        this._windowRef = null;
        this.animation = config.animation;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.popperOptions = config.popperOptions;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this.tooltipClass = config.tooltipClass;
        this.openDelay = config.openDelay;
        this.closeDelay = config.closeDelay;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._positioning = ngbPositioning();
    }
    /**
     * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
     *
     * If the content if falsy, the tooltip won't open.
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    get ngbTooltip() {
        return this._ngbTooltip;
    }
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            const { windowRef, transition$ } = this._popupService.open(this._ngbTooltip, context, this.animation);
            this._windowRef = windowRef;
            this._windowRef.setInput('animation', this.animation);
            this._windowRef.setInput('tooltipClass', this.tooltipClass);
            this._windowRef.setInput('id', this._ngbTooltipWindowId);
            this._renderer.setAttribute(this._getPositionTargetElement(), 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening tooltip from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because tooltip won't work inside the OnPush component.
            // Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the tooltip from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Setting up popper and scheduling updates when zone is stable
            this._ngZone.runOutsideAngular(() => {
                this._positioning.createPopper({
                    hostElement: this._getPositionTargetElement(),
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    appendToBody: this.container === 'body',
                    baseClass: 'bs-tooltip',
                    updatePopperOptions: (options) => this.popperOptions(options),
                });
                Promise.resolve().then(() => {
                    // This update is required for correct arrow placement
                    this._positioning.update();
                    this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positioning.update());
                });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [
                this._windowRef.location.nativeElement,
            ]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    close(animation = this.animation) {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._getPositionTargetElement(), 'aria-describedby');
            this._popupService.close(animation).subscribe(() => {
                this._windowRef = null;
                this._positioning.destroy();
                this._zoneSubscription?.unsubscribe();
                this.hidden.emit();
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen() {
        return this._windowRef != null;
    }
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    }
    ngOnChanges({ tooltipClass }) {
        if (tooltipClass && this.isOpen()) {
            this._windowRef.instance.tooltipClass = tooltipClass.currentValue;
        }
    }
    ngOnDestroy() {
        this.close(false);
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        this._unregisterListenersFn?.();
    }
    _getPositionTargetElement() {
        return ((isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
            this._elementRef.nativeElement);
    }
}
NgbTooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTooltip, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: i1.NgbTooltipConfig }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbTooltip, isStandalone: true, selector: "[ngbTooltip]", inputs: { animation: "animation", autoClose: "autoClose", placement: "placement", popperOptions: "popperOptions", triggers: "triggers", positionTarget: "positionTarget", container: "container", disableTooltip: "disableTooltip", tooltipClass: "tooltipClass", openDelay: "openDelay", closeDelay: "closeDelay", ngbTooltip: "ngbTooltip" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbTooltip"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbTooltip, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbTooltip]', standalone: true, exportAs: 'ngbTooltip' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: i1.NgbTooltipConfig }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], placement: [{
                type: Input
            }], popperOptions: [{
                type: Input
            }], triggers: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], container: [{
                type: Input
            }], disableTooltip: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], ngbTooltip: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLHVCQUF1QixFQUV2QixTQUFTLEVBRVQsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUtMLE1BQU0sRUFLTixpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsY0FBYyxFQUFrQixNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7O0FBS3hDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQWdCZixNQUFNLE9BQU8sZ0JBQWdCOzs2R0FBaEIsZ0JBQWdCO2lHQUFoQixnQkFBZ0IscVVBSGxCOzhEQUNtRDsyRkFFakQsZ0JBQWdCO2tCQWQ1QixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDTCxTQUFTLEVBQUUsc0RBQXNEO3dCQUNqRSxjQUFjLEVBQUUsV0FBVzt3QkFDM0IsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsTUFBTSxFQUFFLElBQUk7cUJBQ1o7b0JBQ0QsUUFBUSxFQUFFOzhEQUNtRDtpQkFDN0Q7OEJBRVMsU0FBUztzQkFBakIsS0FB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Q3JGLDBGQUEwRjtRQUMxRixJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyx5QkFBeUI7UUFDaEMsT0FBTyxDQUNOLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3pHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUM5QixDQUFDO0lBQ0gsQ0FBQzs7dUdBN1JXLFVBQVUsbUxBb0hiLFFBQVE7MkZBcEhMLFVBQVU7MkZBQVYsVUFBVTtrQkFEdEIsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFOzswQkFxSDlFLE1BQU07MkJBQUMsUUFBUTt5R0E1R1IsU0FBUztzQkFBakIsS0FBSztnQkFhRyxTQUFTO3NCQUFqQixLQUFLO2dCQVNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSztnQkFRRyxRQUFRO3NCQUFoQixLQUFLO2dCQVFHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBT0csU0FBUztzQkFBakIsS0FBSztnQkFPRyxjQUFjO3NCQUF0QixLQUFLO2dCQU9HLFlBQVk7c0JBQXBCLEtBQUs7Z0JBT0csU0FBUztzQkFBakIsS0FBSztnQkFPRyxVQUFVO3NCQUFsQixLQUFLO2dCQUtJLEtBQUs7c0JBQWQsTUFBTTtnQkFLRyxNQUFNO3NCQUFmLE1BQU07Z0JBZ0RILFVBQVU7c0JBRGIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFwcGxpY2F0aW9uUmVmLFxuXHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0Q29tcG9uZW50UmVmLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0SW5qZWN0LFxuXHRJbmplY3Rvcixcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRSZW5kZXJlcjIsXG5cdFNpbXBsZUNoYW5nZXMsXG5cdFRlbXBsYXRlUmVmLFxuXHRWaWV3Q29udGFpbmVyUmVmLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IGxpc3RlblRvVHJpZ2dlcnMgfSBmcm9tICcuLi91dGlsL3RyaWdnZXJzJztcbmltcG9ydCB7IG5nYkF1dG9DbG9zZSB9IGZyb20gJy4uL3V0aWwvYXV0b2Nsb3NlJztcbmltcG9ydCB7IG5nYlBvc2l0aW9uaW5nLCBQbGFjZW1lbnRBcnJheSB9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5pbXBvcnQgeyBOZ2JUb29sdGlwQ29uZmlnIH0gZnJvbSAnLi90b29sdGlwLWNvbmZpZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxubGV0IG5leHRJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi10b29sdGlwLXdpbmRvdycsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0J1tjbGFzc10nOiAnXCJ0b29sdGlwXCIgKyAodG9vbHRpcENsYXNzID8gXCIgXCIgKyB0b29sdGlwQ2xhc3MgOiBcIlwiKScsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuXHRcdHJvbGU6ICd0b29sdGlwJyxcblx0XHQnW2lkXSc6ICdpZCcsXG5cdH0sXG5cdHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIiBkYXRhLXBvcHBlci1hcnJvdz48L2RpdlxuXHRcdD48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwV2luZG93IHtcblx0QElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXHRASW5wdXQoKSBpZDogc3RyaW5nO1xuXHRASW5wdXQoKSB0b29sdGlwQ2xhc3M6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0IGFuZCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgdG9vbHRpcCBjcmVhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nYlRvb2x0aXBdJywgc3RhbmRhbG9uZTogdHJ1ZSwgZXhwb3J0QXM6ICduZ2JUb29sdGlwJyB9KVxuZXhwb3J0IGNsYXNzIE5nYlRvb2x0aXAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcblx0c3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9DbG9zZTogYm9vbGVhbiB8IHN0cmluZztcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB0b29sdGlwIG9wZW5pbmcgYW5kIGNsb3Npbmcgd2lsbCBiZSBhbmltYXRlZC5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSB0b29sdGlwIHNob3VsZCBiZSBjbG9zZWQgb24gYEVzY2FwZWAga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3M6XG5cdCAqXG5cdCAqICogYHRydWVgIC0gY2xvc2VzIG9uIGJvdGggb3V0c2lkZSBhbmQgaW5zaWRlIGNsaWNrcyBhcyB3ZWxsIGFzIGBFc2NhcGVgIHByZXNzZXNcblx0ICogKiBgZmFsc2VgIC0gZGlzYWJsZXMgdGhlIGF1dG9DbG9zZSBmZWF0dXJlIChOQjogdHJpZ2dlcnMgc3RpbGwgYXBwbHkpXG5cdCAqICogYFwiaW5zaWRlXCJgIC0gY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuXHQgKiAqIGBcIm91dHNpZGVcImAgLSBjbG9zZXMgb24gb3V0c2lkZSBjbGlja3MgKHNvbWV0aW1lcyBhbHNvIGFjaGlldmFibGUgdGhyb3VnaCB0cmlnZ2Vycylcblx0ICogYXMgd2VsbCBhcyBgRXNjYXBlYCBwcmVzc2VzXG5cdCAqXG5cdCAqIEBzaW5jZSAzLjAuMFxuXHQgKi9cblx0QElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ2luc2lkZScgfCAnb3V0c2lkZSc7XG5cblx0LyoqXG5cdCAqIFRoZSBwcmVmZXJyZWQgcGxhY2VtZW50IG9mIHRoZSB0b29sdGlwLCBhbW9uZyB0aGUgW3Bvc3NpYmxlIHZhbHVlc10oIy9ndWlkZXMvcG9zaXRpb25pbmcjYXBpKS5cblx0ICpcblx0ICogVGhlIGRlZmF1bHQgb3JkZXIgb2YgcHJlZmVyZW5jZSBpcyBgXCJhdXRvXCJgLlxuXHQgKlxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG5cdCAqL1xuXHRASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG5cdC8qKlxuXHQgKiBBbGxvd3MgdG8gY2hhbmdlIGRlZmF1bHQgUG9wcGVyIG9wdGlvbnMgd2hlbiBwb3NpdGlvbmluZyB0aGUgdG9vbHRpcC5cblx0ICogUmVjZWl2ZXMgY3VycmVudCBwb3BwZXIgb3B0aW9ucyBhbmQgcmV0dXJucyBtb2RpZmllZCBvbmVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMTMuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBwb3BwZXJPcHRpb25zOiAob3B0aW9uczogUGFydGlhbDxPcHRpb25zPikgPT4gUGFydGlhbDxPcHRpb25zPjtcblxuXHQvKipcblx0ICogU3BlY2lmaWVzIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSB0b29sdGlwLlxuXHQgKlxuXHQgKiBTdXBwb3J0cyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGV2ZW50IG5hbWVzLlxuXHQgKiBGb3IgbW9yZSBkZXRhaWxzIHNlZSB0aGUgW3RyaWdnZXJzIGRlbW9dKCMvY29tcG9uZW50cy90b29sdGlwL2V4YW1wbGVzI3RyaWdnZXJzKS5cblx0ICovXG5cdEBJbnB1dCgpIHRyaWdnZXJzOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEEgY3NzIHNlbGVjdG9yIG9yIGh0bWwgZWxlbWVudCBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBwb3NpdGlvbmVkIGFnYWluc3QuXG5cdCAqIEJ5IGRlZmF1bHQsIHRoZSBlbGVtZW50IGBuZ2JUb29sdGlwYCBkaXJlY3RpdmUgaXMgYXBwbGllZCB0byB3aWxsIGJlIHNldCBhcyBhIHRhcmdldC5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgcG9zaXRpb25UYXJnZXQ/OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuXHQvKipcblx0ICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cblx0ICpcblx0ICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgYFwiYm9keVwiYC5cblx0ICovXG5cdEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIHRvb2x0aXAgaXMgZGlzYWJsZWQgYW5kIHdvbid0IGJlIGRpc3BsYXllZC5cblx0ICpcblx0ICogQHNpbmNlIDEuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBkaXNhYmxlVG9vbHRpcDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gb3B0aW9uYWwgY2xhc3MgYXBwbGllZCB0byB0aGUgdG9vbHRpcCB3aW5kb3cgZWxlbWVudC5cblx0ICpcblx0ICogQHNpbmNlIDMuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSB0b29sdGlwQ2xhc3M6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIG9wZW5pbmcgZGVsYXkgaW4gbXMuIFdvcmtzIG9ubHkgZm9yIFwibm9uLW1hbnVhbFwiIG9wZW5pbmcgdHJpZ2dlcnMgZGVmaW5lZCBieSB0aGUgYHRyaWdnZXJzYCBpbnB1dC5cblx0ICpcblx0ICogQHNpbmNlIDQuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBvcGVuRGVsYXk6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIGNsb3NpbmcgZGVsYXkgaW4gbXMuIFdvcmtzIG9ubHkgZm9yIFwibm9uLW1hbnVhbFwiIG9wZW5pbmcgdHJpZ2dlcnMgZGVmaW5lZCBieSB0aGUgYHRyaWdnZXJzYCBpbnB1dC5cblx0ICpcblx0ICogQHNpbmNlIDQuMS4wXG5cdCAqL1xuXHRASW5wdXQoKSBjbG9zZURlbGF5OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdG9vbHRpcCBvcGVuaW5nIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuIENvbnRhaW5zIG5vIHBheWxvYWQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdG9vbHRpcCBjbG9zaW5nIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuIENvbnRhaW5zIG5vIHBheWxvYWQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdHByaXZhdGUgX25nYlRvb2x0aXA6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXHRwcml2YXRlIF9uZ2JUb29sdGlwV2luZG93SWQgPSBgbmdiLXRvb2x0aXAtJHtuZXh0SWQrK31gO1xuXHRwcml2YXRlIF9wb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZTxOZ2JUb29sdGlwV2luZG93Pjtcblx0cHJpdmF0ZSBfd2luZG93UmVmOiBDb21wb25lbnRSZWY8TmdiVG9vbHRpcFdpbmRvdz4gfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBfdW5yZWdpc3Rlckxpc3RlbmVyc0ZuO1xuXHRwcml2YXRlIF9wb3NpdGlvbmluZzogUmV0dXJuVHlwZTx0eXBlb2YgbmdiUG9zaXRpb25pbmc+O1xuXHRwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcblx0XHRpbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0dmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcblx0XHRjb25maWc6IE5nYlRvb2x0aXBDb25maWcsXG5cdFx0cHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG5cdFx0QEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcblx0XHRwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0YXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuXHQpIHtcblx0XHR0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG5cdFx0dGhpcy5hdXRvQ2xvc2UgPSBjb25maWcuYXV0b0Nsb3NlO1xuXHRcdHRoaXMucGxhY2VtZW50ID0gY29uZmlnLnBsYWNlbWVudDtcblx0XHR0aGlzLnBvcHBlck9wdGlvbnMgPSBjb25maWcucG9wcGVyT3B0aW9ucztcblx0XHR0aGlzLnRyaWdnZXJzID0gY29uZmlnLnRyaWdnZXJzO1xuXHRcdHRoaXMuY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lcjtcblx0XHR0aGlzLmRpc2FibGVUb29sdGlwID0gY29uZmlnLmRpc2FibGVUb29sdGlwO1xuXHRcdHRoaXMudG9vbHRpcENsYXNzID0gY29uZmlnLnRvb2x0aXBDbGFzcztcblx0XHR0aGlzLm9wZW5EZWxheSA9IGNvbmZpZy5vcGVuRGVsYXk7XG5cdFx0dGhpcy5jbG9zZURlbGF5ID0gY29uZmlnLmNsb3NlRGVsYXk7XG5cdFx0dGhpcy5fcG9wdXBTZXJ2aWNlID0gbmV3IFBvcHVwU2VydmljZTxOZ2JUb29sdGlwV2luZG93Pihcblx0XHRcdE5nYlRvb2x0aXBXaW5kb3csXG5cdFx0XHRpbmplY3Rvcixcblx0XHRcdHZpZXdDb250YWluZXJSZWYsXG5cdFx0XHRfcmVuZGVyZXIsXG5cdFx0XHR0aGlzLl9uZ1pvbmUsXG5cdFx0XHRhcHBsaWNhdGlvblJlZixcblx0XHQpO1xuXHRcdHRoaXMuX3Bvc2l0aW9uaW5nID0gbmdiUG9zaXRpb25pbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgc3RyaW5nIGNvbnRlbnQgb3IgYSBgVGVtcGxhdGVSZWZgIGZvciB0aGUgY29udGVudCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIElmIHRoZSBjb250ZW50IGlmIGZhbHN5LCB0aGUgdG9vbHRpcCB3b24ndCBvcGVuLlxuXHQgKi9cblx0QElucHV0KClcblx0c2V0IG5nYlRvb2x0aXAodmFsdWU6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5fbmdiVG9vbHRpcCA9IHZhbHVlO1xuXHRcdGlmICghdmFsdWUgJiYgdGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IG5nYlRvb2x0aXAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX25nYlRvb2x0aXA7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIFRoaXMgaXMgY29uc2lkZXJlZCB0byBiZSBhIFwibWFudWFsXCIgdHJpZ2dlcmluZy5cblx0ICogVGhlIGBjb250ZXh0YCBpcyBhbiBvcHRpb25hbCB2YWx1ZSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSB0b29sdGlwIHRlbXBsYXRlIHdoZW4gaXQgaXMgY3JlYXRlZC5cblx0ICovXG5cdG9wZW4oY29udGV4dD86IGFueSkge1xuXHRcdGlmICghdGhpcy5fd2luZG93UmVmICYmIHRoaXMuX25nYlRvb2x0aXAgJiYgIXRoaXMuZGlzYWJsZVRvb2x0aXApIHtcblx0XHRcdGNvbnN0IHsgd2luZG93UmVmLCB0cmFuc2l0aW9uJCB9ID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4odGhpcy5fbmdiVG9vbHRpcCwgY29udGV4dCwgdGhpcy5hbmltYXRpb24pO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmID0gd2luZG93UmVmO1xuXHRcdFx0dGhpcy5fd2luZG93UmVmLnNldElucHV0KCdhbmltYXRpb24nLCB0aGlzLmFuaW1hdGlvbik7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYuc2V0SW5wdXQoJ3Rvb2x0aXBDbGFzcycsIHRoaXMudG9vbHRpcENsYXNzKTtcblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5zZXRJbnB1dCgnaWQnLCB0aGlzLl9uZ2JUb29sdGlwV2luZG93SWQpO1xuXG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5fZ2V0UG9zaXRpb25UYXJnZXRFbGVtZW50KCksICdhcmlhLWRlc2NyaWJlZGJ5JywgdGhpcy5fbmdiVG9vbHRpcFdpbmRvd0lkKTtcblxuXHRcdFx0aWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcblx0XHRcdFx0dGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXZSBuZWVkIHRvIGRldGVjdCBjaGFuZ2VzLCBiZWNhdXNlIHdlIGRvbid0IGtub3cgd2hlcmUgLm9wZW4oKSBtaWdodCBiZSBjYWxsZWQgZnJvbS5cblx0XHRcdC8vIEV4LiBvcGVuaW5nIHRvb2x0aXAgZnJvbSBvbmUgb2YgbGlmZWN5Y2xlIGhvb2tzIHRoYXQgcnVuIGFmdGVyIHRoZSBDRFxuXHRcdFx0Ly8gKHNheSBmcm9tIG5nQWZ0ZXJWaWV3SW5pdCkgd2lsbCByZXN1bHQgaW4gJ0V4cHJlc3Npb25IYXNDaGFuZ2VkJyBleGNlcHRpb25cblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cblx0XHRcdC8vIFdlIG5lZWQgdG8gbWFyayBmb3IgY2hlY2ssIGJlY2F1c2UgdG9vbHRpcCB3b24ndCB3b3JrIGluc2lkZSB0aGUgT25QdXNoIGNvbXBvbmVudC5cblx0XHRcdC8vIEV4LiB3aGVuIHdlIHVzZSBleHByZXNzaW9uIGxpa2UgYHt7IHRvb2x0aXAuaXNPcGVuKCkgOiAnb3BlbmVkJyA6ICdjbG9zZWQnIH19YFxuXHRcdFx0Ly8gaW5zaWRlIHRoZSB0ZW1wbGF0ZSBvZiBhbiBPblB1c2ggY29tcG9uZW50IGFuZCB3ZSBjaGFuZ2UgdGhlIHRvb2x0aXAgZnJvbVxuXHRcdFx0Ly8gb3BlbiAtPiBjbG9zZWQsIHRoZSBleHByZXNzaW9uIGluIHF1ZXN0aW9uIHdvbid0IGJlIHVwZGF0ZWQgdW5sZXNzIHdlIGV4cGxpY2l0bHlcblx0XHRcdC8vIG1hcmsgdGhlIHBhcmVudCBjb21wb25lbnQgdG8gYmUgY2hlY2tlZC5cblx0XHRcdHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuXHRcdFx0Ly8gU2V0dGluZyB1cCBwb3BwZXIgYW5kIHNjaGVkdWxpbmcgdXBkYXRlcyB3aGVuIHpvbmUgaXMgc3RhYmxlXG5cdFx0XHR0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9wb3NpdGlvbmluZy5jcmVhdGVQb3BwZXIoe1xuXHRcdFx0XHRcdGhvc3RFbGVtZW50OiB0aGlzLl9nZXRQb3NpdGlvblRhcmdldEVsZW1lbnQoKSxcblx0XHRcdFx0XHR0YXJnZXRFbGVtZW50OiB0aGlzLl93aW5kb3dSZWYhLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0aGlzLnBsYWNlbWVudCxcblx0XHRcdFx0XHRhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG5cdFx0XHRcdFx0YmFzZUNsYXNzOiAnYnMtdG9vbHRpcCcsXG5cdFx0XHRcdFx0dXBkYXRlUG9wcGVyT3B0aW9uczogKG9wdGlvbnMpID0+IHRoaXMucG9wcGVyT3B0aW9ucyhvcHRpb25zKSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB1cGRhdGUgaXMgcmVxdWlyZWQgZm9yIGNvcnJlY3QgYXJyb3cgcGxhY2VtZW50XG5cdFx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG5cdFx0XHRcdFx0dGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IHRoaXMuX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRuZ2JBdXRvQ2xvc2UodGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgdGhpcy5hdXRvQ2xvc2UsICgpID0+IHRoaXMuY2xvc2UoKSwgdGhpcy5oaWRkZW4sIFtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRdKTtcblxuXHRcdFx0dHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHRoaXMuc2hvd24uZW1pdCgpKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSB0b29sdGlwLlxuXHQgKlxuXHQgKiBUaGlzIGlzIGNvbnNpZGVyZWQgdG8gYmUgYSBcIm1hbnVhbFwiIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG5cdCAqL1xuXHRjbG9zZShhbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbik6IHZvaWQge1xuXHRcdGlmICh0aGlzLl93aW5kb3dSZWYgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5fcmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuX2dldFBvc2l0aW9uVGFyZ2V0RWxlbWVudCgpLCAnYXJpYS1kZXNjcmliZWRieScpO1xuXHRcdFx0dGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKGFuaW1hdGlvbikuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fd2luZG93UmVmID0gbnVsbDtcblx0XHRcdFx0dGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLl96b25lU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuXHRcdFx0XHR0aGlzLmhpZGRlbi5lbWl0KCk7XG5cdFx0XHRcdHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHRvb2x0aXAuXG5cdCAqXG5cdCAqIFRoaXMgaXMgY29uc2lkZXJlZCB0byBiZSBhIFwibWFudWFsXCIgdHJpZ2dlcmluZyBvZiB0aGUgdG9vbHRpcC5cblx0ICovXG5cdHRvZ2dsZSgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93UmVmKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub3BlbigpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGB0cnVlYCwgaWYgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IHNob3duLlxuXHQgKi9cblx0aXNPcGVuKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDtcblx0fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG5cdFx0XHR0aGlzLl9yZW5kZXJlcixcblx0XHRcdHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcblx0XHRcdHRoaXMudHJpZ2dlcnMsXG5cdFx0XHR0aGlzLmlzT3Blbi5iaW5kKHRoaXMpLFxuXHRcdFx0dGhpcy5vcGVuLmJpbmQodGhpcyksXG5cdFx0XHR0aGlzLmNsb3NlLmJpbmQodGhpcyksXG5cdFx0XHQrdGhpcy5vcGVuRGVsYXksXG5cdFx0XHQrdGhpcy5jbG9zZURlbGF5LFxuXHRcdCk7XG5cdH1cblxuXHRuZ09uQ2hhbmdlcyh7IHRvb2x0aXBDbGFzcyB9OiBTaW1wbGVDaGFuZ2VzKSB7XG5cdFx0aWYgKHRvb2x0aXBDbGFzcyAmJiB0aGlzLmlzT3BlbigpKSB7XG5cdFx0XHR0aGlzLl93aW5kb3dSZWYhLmluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRvb2x0aXBDbGFzcy5jdXJyZW50VmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0dGhpcy5jbG9zZShmYWxzZSk7XG5cdFx0Ly8gVGhpcyBjaGVjayBpcyBuZWVkZWQgYXMgaXQgbWlnaHQgaGFwcGVuIHRoYXQgbmdPbkRlc3Ryb3kgaXMgY2FsbGVkIGJlZm9yZSBuZ09uSW5pdFxuXHRcdC8vIHVuZGVyIGNlcnRhaW4gY29uZGl0aW9ucywgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjE5OVxuXHRcdHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbj8uKCk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRQb3NpdGlvblRhcmdldEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuXHRcdHJldHVybiAoXG5cdFx0XHQoaXNTdHJpbmcodGhpcy5wb3NpdGlvblRhcmdldCkgPyB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpIDogdGhpcy5wb3NpdGlvblRhcmdldCkgfHxcblx0XHRcdHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==