/** This module defines all Keys for comment Objects and
 *  exports validators for comment-Ids and the comment model based on those keys.
 *
 * @author Dennis Ritter
 *
 * @module routes/comments
 * @type {Router}
 */

// import validation factories
const {createValidateComplete, createValidateId} = require('./common');

// keys for comments
const requiredKeys = {videoid: 'number', text: 'string'};
const optionalKeys = {likes: 'number', dislikes: 'number'};
const internalKeys = {id: 'number', timestamp: 'number'};
const allKeys = Object.assign({}, requiredKeys, optionalKeys, internalKeys);

// build comment validator
const validateComplete = createValidateComplete(requiredKeys, internalKeys, allKeys);
const validateId = createValidateId('comments');

// export comment validators and keys
module.exports = {validateComplete, validateId, requiredKeys, optionalKeys, internalKeys, allKeys};