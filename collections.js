// First up we are going to create a few collections
Quotes = new Mongo.Collection('quotes');  // Our main quote db
Invites = new Mongo.Collection('invites'); // People we want to have on here
// Counters = new Mongo.Collection('counters'); // Handles numbering (which we no longer use really)
// Words = new Mongo.Collection('words'); // Words are the basis of ideas
// There is also a Users collection by default in Meteor and roles from the roles package
Pages = new Mongo.Collection('pages'); // Pages can be Authors or Characters or anyting really
// Profiles = new Mongo.Collection('profiles'); // Users can have profiles, separate from the users collection for tidyness.

// Let's set up some schemas so that our data doesn't get messy
var Schemas = {}; // sets it up in memory or something

// Define the schemas

Schemas.Invite = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

Schemas.Quote = new SimpleSchema({
  authorId: { 
    type: String,
    label: "The _id of an Author attached",
    optional: true
    },
  quotation: { 
    type: String,
    label: "Actual quotation text",
    max: 1000, 
  },
  author: {
    type: String,
    label: "Where the words are coming from",
    max: 512, 
    optional: true,
  },
  source: {
    type: String,
    label: "A publication or Movie etc.",
    max: 512, 
    optional: true,
  },
  topic: {
    type: String,
    label: "What the hell is this about?",
    max: 512, 
    optional: true,
  },
  authorSlug: {
    type: String,
    label: "Auto generated slug of Author",
    max: 512, 
    optional: true,
  },
  sourceSlug: {
    type: String,
    label: "Auto generated slug of Source",
    max: 512, 
    optional: true,
  },
  topicSlug: {
    type: String,
    label: "Auto generated slug of Topic",
    max: 512, 
    optional: true,
  },
  createdAt: { 
    type: Date 
  },
  createdBy: { 
    type: String 
  },
  lastEditedAt: { 
    type: Date, 
    optional: true, 
  },
  lastEditedBy: { 
    type: String, 
    optional: true, 
  },
  slug: {
    type: String,
    label: "Slug",
    // Use this later to throw an error and add quote to other pages
    unique: true,
    max: 512,
  },
  verified: {
    type: Boolean,
    defaultValue: false,
  },
  length: {
    type: String,
    optional: true,
    label: "Set so that CSS can know how big to display",
  },
  pageSlugs: {
    type: [String],
    optional: true,
    label: "An array of things this quote is attached to"
  },
  username: {
    type: String,
    optional: true,
    label: "Whoever created this thing, a string of a name"
  },
  favedBy: {
    type: [String],
    optional: true,
    label: "An array of ids who like this quote"
  },
  faveCount: {
    type: Number,
    optional: true,
    label: "Calculated number from favedBy array"
  }

});

// A page is the solution. A page can be categorised.
Schemas.Page = new SimpleSchema({
  name: {
    type: String,
    label: "Formal name of page",
    unique: true,
    max: 70
  },
  type: {
    type: String,
    label: "author? book? source? topic? what?",
    max: 64,
    optional: true
  },
  createdAt: {
    type: Date
  },
  createdBy: {
    type: String,
    label: "_id of user document"
  },
  lastEditedAt: {
    type: Date,
    optional: true,
  },
  lastEditedBy: {
    type: String,
    label: "_id of user who last edited",
    optional: true,
  },
  slug: {
    type: String,
    label: "URL friendly string of words",
    unique: true,
    max: 500
  },
  verified: {
    type: Boolean,
    defaultValue: false
  },
  deleted: {
    type: Boolean,
    optional: true
  }
});




Schemas.UserCountry = new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    regEx: /^[A-Z]{2}$/
  }
});

Schemas.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  fullName: {
    type: String,
    optional: true
  },
  birthday: {
    type: Date,
    optional: true
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true
  },
  organization : {
    type: String,
    optional: true
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  country: {
    type: Schemas.UserCountry,
    optional: true
  },
  pages: {
    type: [String]
  },
  lastSubmissionTime: {
    type: Date
  },
});

Schemas.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schemas.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: [String],
        optional: true
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});







// Attach the schema objects to the collections
Quotes.attachSchema(Schemas.Quote);
Pages.attachSchema(Schemas.Page);
Invites.attachSchema(Schemas.Invite);
Meteor.users.attachSchema(Schemas.User);


// Trying out collection revisions using todda00:collection-revisions

// CollectionRevisions.Quotes = {
//   keep:2,
//   ignoreWithin: 4,
//   ignoreWithinUnit: 'minutes'
// }
// Quotes.attachCollectionRevisions(CollectionRevisions.Quotes); // let's maybe save it till we need it