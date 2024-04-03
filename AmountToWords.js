
// Amount to Words Code that work in Adobe forms script 
// without the need for calling it from ABAP

// Global data 
// var columns = ["trilions", "bilions", "milions", "thousands"];

var columns =
  [
    {
      singular: "ترليون",
      binary: "ترليونين",
      plural: "ترليونات"
    },
    {
      singular: "مليار",
      binary: "مليارين",
      plural: "مليارات"
    },

    {
      singular: "مليون",
      binary: "مليونين",
      plural: "ملايين"
    },
    {

      singular: "ألف",
      binary: "ألفين",
      plural: "ألآف"
    }

  ];


ones = {
  _1: "واحد",
  _2: "ٱثنين",
  _3: "ثلاثة",
  _4: "أربعة",
  _5: "خمسة",
  _6: "ستة",
  _7: "سبعة",
  _8: "ثمانية",
  _9: "تسعة"
};

teens = {
  _11: "أحد عشر",
  _12: "أثني عشر",
  _13: "ثلاثة عشر",
  _14: "أربعة عشر",
  _15: "خمسة عشر",
  _16: "ستة عشر",
  _17: "سبعة عشر",
  _18: "ثمانية عشر",
  _19: "تسعة عشر"
};

tens = {
  _10: "عشرة",
  _20: "عشرون",
  _30: "ثلاثون",
  _40: "أربعون",
  _50: "خمسون",
  _60: "ستون",
  _70: "سبعون",
  _80: "ثمانون",
  _90: "تسعون"
};

hundreds = {
  _100: "مائة",
  _200: "مائتين",
  _300: "ثلاثمائة",
  _400: "أربعمائة",
  _500: "خمسمائة",
  _600: "ستمائة",
  _700: "سبعمائة",
  _800: "ثمانمائة",
  _900: "تسعمائة"
};

thousands = {
  singular: "ألف",
  binary: "ألفين",
  plural: "ألآف"
};

milions = {
  singular: "مليون",
  binary: "مليونين",
  plural: "ملايين"
};

bilions = {
  singular: "مليار",
  binary: "مليارين",
  plural: "مليارات"
};

trilions = {
  singular: "ترليون",
  binary: "ترليونين",
  plural: "ترليونات"
};

currencies = {

  SAR: {
    singular: "ريال سعودي",
    plural: "ريالات سعودية",
    fraction: "هللة",
    fractions: "هللات",
    decimals: 2
  }

};

var gFraction = 0;
var gDigit = 0;
var gCurr = "SAR";

function Tafgeet(digit) {

  //Split to INT & Fraction
  var splitted = digit.toString().split(".");
  gFraction = 0;
  if (splitted.length > 1) {
    var fraction;
    if (splitted[1].length > 1) {
      fraction = parseInt(splitted[1]);
      if (fraction >= 1 && fraction <= 99) {
        gFraction = splitted[1].length === 1 ? fraction * 10 : fraction;
      } else {

        //var trimmed = Array.from(splitted[1]);
        var trimmed = splitted[1].split('');
        gFraction = "";
        for (var index = 0; index < currencies[gCurr].decimals; index++) {
          gFraction += trimmed[index];
        }
      }
    } else {
      gFraction = parseInt(splitted[1]);
    }
  }
  gDigit = splitted[0];
  //gCurr = currency;
}

function parse() {
  var serialized = [];
  var tmp = [];
  var inc = 1;
  var count = gDigit.length;
  var column = getColumnIndex();
  if (count >= 16) {
    return;
  }

  // Sperate the number into columns
  var reversedDigits = gDigit.toString().split('').reverse();

  for (var i = 0; i < reversedDigits.length; i++) {
    var d = reversedDigits[i]; // Current digit

    tmp.push(d); // Add the current digit to the temporary array

    // Check if we have processed three digits or reached the end of the digits
    if (inc % 3 === 0 || i === reversedDigits.length - 1) {
      serialized.unshift(tmp); // Add the current group of digits to the serialized array
      tmp = []; // Reset the temporary array
    }

    inc++; // Increment the counter
  }



  // gDigit.toString().split('').reverse().forEach(function (d, i) {
  //   tmp.push(d);
  //   if (inc == 3) {
  //     serialized.unshift(tmp);
  //     tmp = [];
  //     inc = 0;
  //   }
  //   // if the remaining digits less that 3 then add them to serialized 
  //   if (inc == 0 && count - (i + 1) < 3 && count - (i + 1) != 0) {
  //     serialized.unshift(tmp);
  //   }
  //   inc++;
  // });

  // var arr = gDigit.toString().split('').reverse();
  // for (var i in arr) {
  //   tmp.push(arr[i]);
  //   if (inc == 3) {
  //     serialized.unshift(tmp);
  //     tmp = [];
  //     inc = 0;
  //   }

  //   if (inc == 0 && count - (i + 1) < 3 && count - (i + 1) != 0) {
  //     serialized.unshift(tmp);
  //   }
  //   inc++;
  // }

  //  debugger;
  // Generate concatenation array
  var concats = []
  for (i = getColumnIndex(); i < columns.length; i++) {
    concats[i] = " و";
  }

  //We do not need some "و"s check last column if 000 drill down until otherwise
  if (gDigit > 999) {
    if (parseInt((serialized[serialized.length - 1]).join("")) == 0) {
      //if (parseInt(Array.from(serialized[serialized.length - 1]).join("")) == 0){
      concats[parseInt(concats.length - 1)] = "";
      for (i = serialized.length - 1; i >= 1; i--) {
        if (parseInt((serialized[i]).join("")) == 0) {
          concats[i] = ""
        } else {
          break;
        }
      }
    }
  }

  var str = "";
  str += "فقط ";

  if (gDigit.length >= 1 && gDigit.length <= 3) {
    str += read(gDigit);
  } else {
    for (i = 0; i < serialized.length; i++) {
      var joinedNumber = parseInt(serialized[i].reverse().join(""));
      if (joinedNumber == 0) {
        column++;
        continue;
      }
      if (column == null || column + 1 > columns.length) {
        str += read(joinedNumber);
      } else {
        str += addSuffixPrefix(serialized[i], column) + concats[column];
      }
      column++;
    }
  }

  if (gCurr != "") {
    if (gDigit >= 3 && gDigit <= 10) {
      str += " " + currencies[gCurr].plural;
    } else {
      str += " " + currencies[gCurr].singular;
    }
    if (gFraction != 0) {
      if (gDigit >= 3 && gDigit <= 10) {
        str +=
          " و" +
          read(gFraction) +
          " " +
          currencies[gCurr].fractions;
      } else {
        str +=
          " و" +
          read(gFraction) +
          " " +
          currencies[gCurr].fraction;
      }
    }
  }

  str += " لا غير";
  return str;
};


function addSuffixPrefix(arr, column) {
  if (arr.length == 1) {
    if (parseInt(arr[0]) == 1) {
      //return [columns[column]].singular;  // bug here
      return columns[column].singular;
    }
    if (parseInt(arr[0]) == 2) {
      return columns[column].binary;
    }
    if (parseInt(arr[0]) > 2 && parseInt(arr[0]) <= 9) {
      return (
        readOnes(parseInt(arr[0])) +
        " " +
        columns[column].plural
      );
    }
  } else {
    var joinedNumber = parseInt(arr.join(""));
    if (joinedNumber > 1) {
      return read(joinedNumber) + " " + columns[column].singular;
    } else {
      return columns[column].singular;
    }
  }
};

function read(d) {
  var str = "";
  var len = d.toString().length;
  if (len == 1) {
    str += readOnes(d);
  } else if (len == 2) {
    str += readTens(d);
  } else if (len == 3) {
    str += readHundreds(d);
  }
  return str;
};

function readOnes(d) {
  if (d == 0) return;
  return ones["_" + d.toString()];
};

function readTens(d) {
  if (d.toString().split('')[1] === "0") {
    return tens["_" + d.toString()];
  }
  if (d > 10 && d < 20) {
    return teens["_" + d.toString()];
  }
  if (d > 19 && d < 100 && d.toString().split('')[1] !== "0") {
    return (
      readOnes(d.toString().split('')[1]) +
      " و" +
      tens["_" + d.toString().split('')[0] + "0"]
    );
  }
};

function readHundreds(d) {
  var str = "";
  str += hundreds["_" + d.toString().split('')[0] + "00"];

  if (
    d.toString().split('')[1] === "0" &&
    d.toString().split('')[2] !== "0"
  ) {
    str += " و" + readOnes(d.toString().split('')[2]);
  }

  if (d.toString().split('')[1] !== "0") {
    str +=
      " و" +
      readTens(
        (d.toString().split('')[1] + d.toString().split('')[2]).toString()
      );
  }
  return str;
};

function getColumnIndex() {
  var column = null;
  if (gDigit.length > 12) {
    column = 0;
  } else if (gDigit.length <= 12 && gDigit.length > 9) {
    column = 1;
  } else if (gDigit.length <= 9 && gDigit.length > 6) {
    column = 2;
  } else if (gDigit.length <= 6 && gDigit.length >= 4) {
    column = 3;
  }
  return column;
};

Tafgeet(321515020.25);
var result = parse();
console.log(result);
//  this.rawValue = result;
