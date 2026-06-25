import {
  MediaMatcher
} from "./chunk-ZTIJR2AH.js";
import {
  ANIMATION_MODULE_TYPE,
  Injectable,
  InjectionToken,
  NgModule,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-GB2S65Z7.js";

// node_modules/@angular/material/fesm2022/_error-options-chunk.mjs
var ShowOnDirtyErrorStateMatcher = class _ShowOnDirtyErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.dirty || form && form.submitted));
  }
  static ɵfac = function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShowOnDirtyErrorStateMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ShowOnDirtyErrorStateMatcher,
    factory: _ShowOnDirtyErrorStateMatcher.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
    type: Injectable
  }], null, null);
})();
var ErrorStateMatcher = class _ErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.touched || form && form.submitted));
  }
  static ɵfac = function ErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorStateMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ErrorStateMatcher,
    factory: _ErrorStateMatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LayoutModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/_animation-chunk.mjs
var MATERIAL_ANIMATIONS = new InjectionToken("MATERIAL_ANIMATIONS");
var reducedMotion = null;
function _getAnimationsState() {
  if (inject(MATERIAL_ANIMATIONS, {
    optional: true
  })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, {
    optional: true
  }) === "NoopAnimations") {
    return "di-disabled";
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia("(prefers-reduced-motion)").matches;
  return reducedMotion ? "reduced-motion" : "enabled";
}
function _animationsDisabled() {
  return _getAnimationsState() !== "enabled";
}

// node_modules/@angular/cdk/fesm2022/_test-environment-chunk.mjs
function _isTestEnvironment() {
  return typeof __karma__ !== "undefined" && !!__karma__ || typeof jasmine !== "undefined" && !!jasmine || typeof jest !== "undefined" && !!jest || typeof Mocha !== "undefined" && !!Mocha;
}

// node_modules/@angular/cdk/fesm2022/platform.mjs
var PlatformModule = class _PlatformModule {
  static ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlatformModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PlatformModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var supportedInputTypes;
var candidateInputTypes = ["color", "button", "checkbox", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"];
function getSupportedInputTypes() {
  if (supportedInputTypes) {
    return supportedInputTypes;
  }
  if (typeof document !== "object" || !document) {
    supportedInputTypes = new Set(candidateInputTypes);
    return supportedInputTypes;
  }
  let featureTestInput = document.createElement("input");
  supportedInputTypes = new Set(candidateInputTypes.filter((value) => {
    featureTestInput.setAttribute("type", value);
    return featureTestInput.type === value;
  }));
  return supportedInputTypes;
}

// node_modules/@angular/cdk/fesm2022/_css-pixel-value-chunk.mjs
function coerceCssPixelValue(value) {
  if (value == null) {
    return "";
  }
  return typeof value === "string" ? value : `${value}px`;
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}
function coerceStringArray(value, separator = /\s+/) {
  const result = [];
  if (value != null) {
    const sourceValues = Array.isArray(value) ? value : `${value}`.split(separator);
    for (const sourceValue of sourceValues) {
      const trimmedString = `${sourceValue}`.trim();
      if (trimmedString) {
        result.push(trimmedString);
      }
    }
  }
  return result;
}

// node_modules/@angular/material/fesm2022/_error-state-chunk.mjs
var _ErrorStateTracker = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = false;
  matcher;
  constructor(_defaultMatcher, ngControl, _parentFormGroup, _parentForm, _stateChanges) {
    this._defaultMatcher = _defaultMatcher;
    this.ngControl = ngControl;
    this._parentFormGroup = _parentFormGroup;
    this._parentForm = _parentForm;
    this._stateChanges = _stateChanges;
  }
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.matcher || this._defaultMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher?.isErrorState(control, parent) ?? false;
    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
};

export {
  ShowOnDirtyErrorStateMatcher,
  ErrorStateMatcher,
  MATERIAL_ANIMATIONS,
  _getAnimationsState,
  _animationsDisabled,
  _isTestEnvironment,
  getSupportedInputTypes,
  coerceCssPixelValue,
  coerceBooleanProperty,
  coerceStringArray,
  _ErrorStateTracker
};
//# sourceMappingURL=chunk-IE5PMRNT.js.map
