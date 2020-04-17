//数字键盘输入框（加强版，不报错版）
function NumKeyBoard(options, jquery) {
  var defaultOptions = {
    insideInput: false, //是否显示input框
    precision: 2, //精确度
    minVal: 0,
    maxVal: 0,
    otherElem: null,
    inpType: 'number' // 输入框类型
  };




  var param = jquery.extend(defaultOptions, options);

  this.minVal = param.minVal;
  this.maxVal = param.maxVal;

  this.precision = param.precision;
  if (jquery("#numKeyBoard-box").length) {
    jquery("#numKeyBoard-box").css("display", "block");
    return;
  }

  //创建数字键盘table
  var inputStr = '<input class="numKeyBoardInput" readonly="readonly"/>';
  var tableStr = '<table border="0" cellspacing="0" cellpadding="0" class="numKeyBoardTable">';
  tableStr += '<tr class="numTr"><td>1</td><td>2</td><td>3</td></tr>';
  tableStr += '<tr class="numTr"><td>4</td><td>5</td><td>6</td></tr>';
  tableStr += '<tr class="numTr"><td>7</td><td>8</td><td>9</td></tr>';
  tableStr += '<tr><td class="dotTd">.</td><td class="zeroTd">0</td>';
  tableStr += '<td class="delTd">删除</td></tr>';
  tableStr += '</table>';

  var nbtn = '<div class="fBottom">';
  nbtn += '<div class="saveBtn">确认</div><div class="cancleBtn" >取消</div>';
  nbtn += '</div>';
  var nHtml = inputStr + tableStr + nbtn;
  var nbox = "<div id='numKeyBoard-box'><div class='numPadLayerBox'><div class='numPadLayerBox-cot'>" + nHtml + "</div></div></div>";
  jquery('body').append(nbox);

  this.inputValue = "";
  if (param.insideInput) {
    jquery(".numKeyBoardInput").css("display", 'block');
    jquery(".numPadLayerBox-cot").css('height', '400px');
  } else {
    jquery(".numKeyBoardInput").css("display", 'none');
    jquery(".numPadLayerBox-cot").css('height', '360px');
  }

  if (param.otherElem == null || param.otherElem == '' || param.otherElem == undefined) {} else {
    var stationOffset = jquery(param.otherElem).offset();
    if (param.otherElem != '#meter') {
      jquery(".numPadLayerBox-cot").css({
        'margin-top': stationOffset.top + jquery(param.otherElem).height() + 30 + 'px',
        'margin-right': 1024 - stationOffset.left + 'px'
      });
    }
  }

  this.input = param.otherElem == null ? jquery(".numKeyBoardInput") : jquery(param.otherElem);
  this.input.attr('type', 'text');
  var self = this;

  //数字按键
  jquery("#numKeyBoard-box .numTr td").click(function (e) {
    if (param.inpType === 'number') {
      if (self.inputValue.length == 1 && self.inputValue == 0) return;
    }
    if (self.inputValue) {
      if (!validPrecision(self.inputValue)) return;
    }
    var ev = e || window.event;
    var clickEl = ev.element || ev.target;
    var tdVal = jquery(clickEl).html();
    self.inputValue = self.inputValue + tdVal;
    self.input.val(self.inputValue);
  });

  //删除按键
  jquery("#numKeyBoard-box .delTd").click(function () {
    if (self.inputValue) {
      self.inputValue = self.inputValue.substr(0, self.inputValue.length - 1);
      self.input.val(self.inputValue);
    }
  });

  //小数点按键
  jquery("#numKeyBoard-box .dotTd").click(function () {
    if (!self.precision) return;

    if (self.inputValue) {
      if (self.inputValue.indexOf(".") != -1) return;
      self.inputValue = self.inputValue + '.';
      self.input.val(self.inputValue);
    } else {
      self.inputValue = "0.";
      self.input.val(self.inputValue);
    }
  });

  //0按键
  jquery("#numKeyBoard-box .zeroTd").click(function () {
    if (self.inputValue) {
      if (!validPrecision(self.inputValue)) return;
      if (param.inpType === 'number') {
        if (self.inputValue.length == 1 && self.inputValue == 0) return;
      }
      self.inputValue = self.inputValue + '0';
      self.input.val(self.inputValue);
    } else {
      self.inputValue = "0";
      self.input.val(self.inputValue);
    }
  });


  //验证精度
  function validPrecision(str) {
    if (str && str.indexOf(".") != -1) {
      var len = str.split(".")[1].length;
      if (len == self.precision) return false;
    }
    return true;
  }

  //确认
  jquery(".saveBtn").click(function () {
    var val = self.input.val();

    var re = /\.$/;
    if (re.test(val)) return;

    if (self.minVal == 0 && self.maxVal == 0) {

    } else {
      if (self.minVal && val < self.minVal) {
        alert('输入值不可小于' + self.minVal);
        return false;
      }

      if (self.maxVal && val > self.maxVal) {
        alert('输入值不可大于' + self.maxVal);
        return false;
      }
    }

    if (self.confirmCallback) {
      self.confirmCallback(val);
    }

    jquery("#numKeyBoard-box").remove();
  });


  //取消
  jquery(".cancleBtn").click(function () {
    self.input.val('');
    jquery("#numKeyBoard-box").remove();
    self.setNumVal('');
  });

  //确认的callBack

  this.confirmCallback = function (val) {
    self.setNumVal(val);
  };

  //获取input数值
  this.getNumVal = function () {
    return self.inputValue;
  };

  //设置input数值
  this.setNumVal = function (val) {
    self.input.val(val);
    self.inputValue = val;
  };

  // 打开弹窗
  this.open = function (callback) {
    self.setNumVal('');
    jquery("#numKeyBoard-box").show();
    self.confirmCallback = callback;
  };

  // 销毁弹窗
  this.destroy = function () {
    jquery("#numKeyBoard-box").remove();
  };

}
