//
// A DataStructure that allows for a string and an integer to be the keys in a
// collection
//
// Made to prioritize adding and retrieving information in near constant time.
// Removing is closer to linear time
//
// The collection is zero indexed AND indexed by name
//
var ObjArray = function() {

	//the underlying structures
	this._obj = {};
	this._arr = [];

}

//
// Add in a new object with the associated name
//
// Should be close to O(1) complexity
//
ObjArray.prototype.add = function(name, obj) {

	this._obj[name] = obj;
	this._arr.push(name);

}

//
// Remove the object associate with the given name
//
// This data structure will eventually get full of null objects and cause a
// lot of garbage / a huge object.
//
// A better implementation should have some way to quickly remove the null
// properties from the _obj collection.
//
ObjArray.prototype.remove = function(name) {

	//remove by setting this object to null
	this._obj[name] = null;

	//remove by splicing this object
	for (var i = 0; i < this._arr.length; i++) {
		if (this._arr[i] === name) {
			this._arr.splice(i,1);
		}
	}

}

//
// Retrieve based on string or integer identifier
//
ObjArray.prototype.get = function(id) {
	if (typeof id === 'string') {
		return this._obj[id];
	}
	else if (typeof id === 'number') {
		return this._obj[this._arr[id]];
	}
}

//
// Returns the number of items in this collection
//
ObjArray.prototype.length = function() {
	return this._arr.length;
};


//export constructor
module.exports = ObjArray;
