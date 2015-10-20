// Super secret next step forward
Router.route('/', {
  action: function () {
    Session.set("DocumentTitle","Qurious");    

    // Here we send a quote to the front page if required
    Meteor.subscribe('quotesLatest', 1);

    this.render('Lite', {
      data: function () {
        return Quotes.findOne({});
      }
    });
  }
});

Router.route('/q/:_quote_id', {
  // waitOn: function () {
  //   // return one handle, a function, or an array
  //   return Meteor.subscribe('quotesAll');
  // },
  
  action: function () {
    Meteor.subscribe('quotesAll');
    this.render('Lite', {
      data: function () {
        var quote = Quotes.findOne({ _id: this.params._quote_id });
        if (!quote) {
          quote = Quotes.findOne({ quote_id: this.params._quote_id });
        }
        if (!quote) {
          // this.render('NotFound');
        } 
        else {
          // Session.set('sessionQuoteId', this.params._quote_id);
          // Meteor.call('checkQuoteSize', this.params._quote_id); // small or big?

          // Let's try to get substring some text for the Title Bar
          // this regular expression is gold (i didn't write it btw)
          var titleText = quote.quotation.replace(/^(.{50}[^\s]*).*/, "$1");

          Session.set("DocumentTitle", titleText + " - Qurious");

          return quote;
        }
      }
    });
  }
});

Router.route('/r', {  
  action: function () {
    Meteor.call('getRandomQuoteIdShort', function (error, result) {
      var randomId = result;
      // replaceState keeps the browser from duplicating history
      Router.go('/q/' + randomId, {}, {replaceState:true});
    });
  },
});