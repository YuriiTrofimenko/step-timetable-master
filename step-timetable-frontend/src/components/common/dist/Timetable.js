"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var react_1 = require("react");
var styles_1 = require("@material-ui/core/styles");
var mobx_react_1 = require("mobx-react");
var core_1 = require("@material-ui/core");
var react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
var styles = function (theme) { return styles_1.createStyles({
    root: {
        color: 'red',
        '& .MuiCard-root': {
            /* fontSize: 11, */
            width: 95,
            height: 100
        }
    },
    cardsCell: {
        display: 'flex',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        '& span': {
            margin: 0,
            flexGrow: 1,
            display: 'flex'
        }
    },
    selectedCardsCell: {
        backgroundColor: 'lightblue'
    },
    card: {
        display: 'flex',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-evenly'
    },
    lessonCard: {
        textAlign: 'left',
        '& > div': {
            padding: '5px',
            '& > span': {
                margin: 0
            }
        }
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)'
    },
    title: {
        fontSize: 11
    },
    pos: {
        marginBottom: 12
    }
}); };
var Timetable = /** @class */ (function (_super) {
    __extends(Timetable, _super);
    function Timetable(props) {
        var _this = _super.call(this, props) || this;
        _this.lessonCardClickHandler = function (intervalRowId, lessonCardId) {
            _this.injected.timeIntervalStore.setSelectedLessonCard(intervalRowId, lessonCardId);
            _this.setState({ lessonDialogOpen: true });
        };
        _this.lessonDialogClosedHandler = function () {
            console.log('selectedLessonCard', _this.injected.timeIntervalStore.selectedLessonCard);
            _this.setState({ lessonDialogOpen: false });
            _this.injected.timeIntervalStore.unsetSelectedLessonCard();
        };
        _this.lessonDialogCancelHandler = function () {
            _this.setState({ lessonDialogOpen: false });
            _this.injected.timeIntervalStore.unsetSelectedLessonCard();
        };
        _this.lessonDialogOkHandler = function () {
            _this.injected.timeIntervalStore.saveLessonCard();
            _this.setState({ lessonDialogOpen: false });
            _this.injected.timeIntervalStore.unsetSelectedLessonCard();
        };
        _this.groupSelectedHandler = function (e) {
            var _a;
            var lessonCardGroupId = e.target.value;
            if (typeof lessonCardGroupId === 'number') {
                _this.injected.timeIntervalStore.setLessonCardGroupId(lessonCardGroupId);
                (_a = document === null || document === void 0 ? void 0 : document.getElementById('productCategoryValidator')) === null || _a === void 0 ? void 0 : _a.setAttribute('value', lessonCardGroupId.toString());
            }
        };
        _this.lecturerSelectedHandler = function (e) {
            var lessonCardLecturerId = e.target.value;
            if (typeof lessonCardLecturerId === 'number') {
                _this.injected.timeIntervalStore.setLessonCardLecturerId(lessonCardLecturerId);
            }
        };
        _this.state = {
            lessonDialogOpen: false
        };
        return _this;
    }
    Object.defineProperty(Timetable.prototype, "injected", {
        get: function () {
            return this.props;
        },
        enumerable: false,
        configurable: true
    });
    Timetable.prototype.componentDidMount = function () {
        this.injected.headerCardStore.fetchHeaderCardList();
        this.injected.timeIntervalStore.fetchTimeIntervalList();
        this.injected.groupStore.fetchGroupList();
        this.injected.lecturerStore.fetchLecturerList();
    };
    Timetable.prototype.render = function () {
        var _this = this;
        var classes = this.injected.classes;
        var headerCardList = this.injected.headerCardStore.headerCardList;
        var _a = this.injected.timeIntervalStore, timeIntervalList = _a.timeIntervalList, selectedLessonCard = _a.selectedLessonCard, lessonCardGroupId = _a.lessonCardGroupId, lessonCardLecturerId = _a.lessonCardLecturerId;
        var groupList = this.injected.groupStore.groupList;
        var lecturerList = this.injected.lecturerStore.lecturerList;
        console.log('selectedLessonCard render', selectedLessonCard);
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(core_1.Grid, { container: true, spacing: 3, className: classes.root },
                react_1["default"].createElement(core_1.Grid, { item: true, xs: 12, className: classes.cardsCell },
                    react_1["default"].createElement(core_1.Box, { component: 'span' },
                        react_1["default"].createElement(core_1.Card, { className: classes.card },
                            react_1["default"].createElement(core_1.CardContent, null,
                                react_1["default"].createElement(core_1.Typography, { variant: "h6", component: "h3" }, "\u00A0\u00A0\u00A0")))),
                    headerCardList.map(function (headerCardModel, headerCardIdx) { return (react_1["default"].createElement(core_1.Box, { component: 'span', key: headerCardIdx },
                        react_1["default"].createElement(core_1.Card, { className: classes.card },
                            react_1["default"].createElement(core_1.CardContent, null,
                                react_1["default"].createElement(core_1.Typography, { variant: "h6", component: "h3" }, headerCardModel.audienceNumber))))); })),
                timeIntervalList.map(function (timeIntervalModel, intervalIdx) { return (react_1["default"].createElement(core_1.Grid, { item: true, xs: 12, className: classes.cardsCell, key: intervalIdx },
                    react_1["default"].createElement(core_1.Box, { component: 'span' },
                        react_1["default"].createElement(core_1.Card, { className: classes.card && ((_this.injected.timeIntervalStore.currentTimeIntervalId) ? classes.selectedCardsCell : '') },
                            react_1["default"].createElement(core_1.CardContent, null,
                                react_1["default"].createElement(core_1.Typography, { variant: "subtitle1" }, timeIntervalModel.intervalStart),
                                react_1["default"].createElement(core_1.Typography, { variant: "subtitle1" }, timeIntervalModel.intervalEnd)))),
                    timeIntervalModel.lessonCards.map(function (lessonCardModel, lessonIdx) {
                        var _a, _b;
                        return (react_1["default"].createElement(core_1.Box, { component: 'span', key: lessonIdx },
                            react_1["default"].createElement(core_1.Card, { className: classes.card && classes.lessonCard, onClick: function () {
                                    _this.lessonCardClickHandler(timeIntervalModel.id || null, lessonCardModel.id || null);
                                } },
                                react_1["default"].createElement(core_1.CardContent, null,
                                    react_1["default"].createElement(core_1.Typography, { variant: "caption", display: "block" }, lessonCardModel.audienceNumber),
                                    react_1["default"].createElement(core_1.Typography, { variant: "body2", component: "p" }, (_a = groupList.find(function (group) { return group.id === lessonCardModel.groupId; })) === null || _a === void 0 ? void 0 : _a.name),
                                    react_1["default"].createElement(core_1.Typography, { variant: "caption", display: "block" }, (_b = lecturerList.find(function (lecturer) { return lecturer.id === lessonCardModel.lecturerId; })) === null || _b === void 0 ? void 0 : _b.name)))));
                    }))); })),
            react_1["default"].createElement(core_1.Dialog, { open: this.state.lessonDialogOpen, onClose: this.lessonDialogClosedHandler, "aria-labelledby": "form-dialog-title" },
                react_1["default"].createElement(core_1.DialogTitle, { id: "form-dialog-title" }, (selectedLessonCard === null || selectedLessonCard === void 0 ? void 0 : selectedLessonCard.lecturerId) ? 'Изменить занятие' : 'Создать занятие'),
                react_1["default"].createElement(core_1.DialogContent, null,
                    react_1["default"].createElement(react_material_ui_form_validator_1.ValidatorForm, { onError: function (errors) { return console.log(errors); } },
                        react_1["default"].createElement(core_1.FormControl, { fullWidth: true },
                            react_1["default"].createElement(core_1.InputLabel, { id: "group-select-label" }, "\u0413\u0440\u0443\u043F\u043F\u0430"),
                            react_1["default"].createElement(core_1.Select, { labelId: "group-select-label", id: "group-select", value: lessonCardGroupId, onChange: this.groupSelectedHandler }, groupList.map(function (group) {
                                return (react_1["default"].createElement(core_1.MenuItem, { key: group.id, value: group.id }, group.name));
                            })),
                            react_1["default"].createElement("input", { id: 'groupValidator', tabIndex: -1, autoComplete: "off", style: { opacity: 0, height: 0 }, value: lessonCardGroupId === null || lessonCardGroupId === void 0 ? void 0 : lessonCardGroupId.toString(), required: true })),
                        react_1["default"].createElement(core_1.FormControl, { fullWidth: true },
                            react_1["default"].createElement(core_1.InputLabel, { id: "lecturer-select-label" }, "\u041F\u0440\u0435\u043F\u043E\u0434\u0430\u0432\u0430\u0442\u0435\u043B\u044C"),
                            react_1["default"].createElement(core_1.Select, { labelId: "lecturer-select-label", id: "lecturer-select", value: lessonCardLecturerId, onChange: this.lecturerSelectedHandler }, lecturerList.map(function (lecturer) {
                                return (react_1["default"].createElement(core_1.MenuItem, { key: lecturer.id, value: lecturer.id }, lecturer.name));
                            })),
                            react_1["default"].createElement("input", { id: 'lecturerValidator', tabIndex: -1, autoComplete: "off", style: { opacity: 0, height: 0 }, value: lessonCardLecturerId === null || lessonCardLecturerId === void 0 ? void 0 : lessonCardLecturerId.toString(), required: true })))),
                react_1["default"].createElement(core_1.DialogActions, null,
                    react_1["default"].createElement(core_1.Button, { onClick: this.lessonDialogCancelHandler, color: "primary" }, "\u041E\u0442\u043C\u0435\u043D\u0430"),
                    react_1["default"].createElement(core_1.Button, { onClick: this.lessonDialogOkHandler, color: "primary" }, (selectedLessonCard === null || selectedLessonCard === void 0 ? void 0 : selectedLessonCard.lecturerId) ? 'Обновить' : 'Добавить')))));
    };
    Timetable = __decorate([
        mobx_react_1.inject('headerCardStore', 'timeIntervalStore', 'groupStore', 'lecturerStore'),
        mobx_react_1.observer
    ], Timetable);
    return Timetable;
}(react_1.Component));
exports["default"] = styles_1.withStyles(styles)(Timetable);
