'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _frame = require('./frame');

var _frame2 = _interopRequireDefault(_frame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

// Utilities
// Packages

var Keyframes = function (_React$Component) {
  (0, _inherits3.default)(Keyframes, _React$Component);

  function Keyframes(props) {
    (0, _classCallCheck3.default)(this, Keyframes);

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

    _this.state = {
      frameNum: _this.props.delay ? -1 : 0,
      loopNum: 0
    };
    _this.timer = null;
    return _this;
  }

  Keyframes.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    var frameNum = nextState.frameNum;

    if (this.state.frameNum === frameNum) {
      return false;
    }
    return frameNum >= 0 && frameNum < this.props.children.length;
  };

  Keyframes.prototype.componentWillMount = function componentWillMount() {
    if (this.state.frameNum === 0) {
      this.props.onStart();
    }
  };

  Keyframes.prototype.componentWillUpdate = function componentWillUpdate() {
    if (this.state.frameNum === 0) {
      this.props.onStart();
    }
  };

  Keyframes.prototype.componentDidMount = function componentDidMount() {
    this.requestNextFrame();
  };

  Keyframes.prototype.componentDidUpdate = function componentDidUpdate() {
    this.requestNextFrame();
  };

  Keyframes.prototype.componentWillUnmount = function componentWillUnmount() {
    clearTimeout(this.timer);
  };

  Keyframes.prototype.render = function render() {
    var _this2 = this;

    var frame = this.getFrame();
    if (!frame) {
      return null;
    }

    var props = {};
    (0, _keys2.default)(this.props).forEach(function (k) {
      // Don't pass props which exist only on Keyframes
      if (Keyframes.propTypes[k] && !_frame2.default.propTypes[k]) {
        return;
      }

      props[k] = _this2.props[k];
    });

    return _react2.default.cloneElement(frame, (0, _extends3.default)({}, props, frame.props));
  };

  Keyframes.prototype.requestNextFrame = function requestNextFrame() {
    var _this3 = this;

    this.waitForDelay(function () {
      var frameNum = _this3.state.frameNum + 1;
      var loopNum = _this3.state.loopNum + 1;
      if (_this3.props.children.length <= frameNum) {
        if (_this3.props.loop === true || _this3.props.loop === 'infinite' || loopNum < _this3.props.loop) {
          _this3.setState({
            frameNum: 0,
            loopNum: loopNum
          });
          _this3.requestNextFrame();
          return;
        }
        _this3.props.onEnd();
        return;
      }

      _this3.setState({ frameNum: frameNum });
    });
  };

  Keyframes.prototype.waitForDelay = function waitForDelay(fn) {
    var currentFrame = this.getFrame();
    var delay = currentFrame ? currentFrame.props.duration : this.props.delay;
    clearTimeout(this.timer);
    this.timer = setTimeout(fn, delay);
  };

  Keyframes.prototype.getFrame = function getFrame() {
    return this.props.children[this.state.frameNum];
  };

  return Keyframes;
}(_react2.default.Component);

Keyframes.propTypes = {
  children: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired,
  component: _propTypes2.default.any, // eslint-disable-line react/no-unused-prop-types
  delay: _propTypes2.default.number,
  loop: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]),
  onStart: _propTypes2.default.func,
  onEnd: _propTypes2.default.func
};
Keyframes.defaultProps = {
  component: 'span',
  delay: 0,
  loop: 1,
  onStart: noop,
  onEnd: noop
};
exports.default = Keyframes;