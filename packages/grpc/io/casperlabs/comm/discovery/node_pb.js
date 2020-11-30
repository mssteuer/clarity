/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.io.casperlabs.comm.discovery.Node', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.io.casperlabs.comm.discovery.Node = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.io.casperlabs.comm.discovery.Node, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.io.casperlabs.comm.discovery.Node.displayName = 'proto.io.casperlabs.comm.discovery.Node';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.toObject = function(opt_includeInstance) {
  return proto.io.casperlabs.comm.discovery.Node.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.io.casperlabs.comm.discovery.Node} msg The msg instance to transform.
 * @return {!Object}
 */
proto.io.casperlabs.comm.discovery.Node.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64(),
    host: msg.getHost(),
    protocolPort: msg.getProtocolPort(),
    discoveryPort: msg.getDiscoveryPort(),
    chainId: msg.getChainId_asB64(),
    nodeVersion: msg.getNodeVersion()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.io.casperlabs.comm.discovery.Node}
 */
proto.io.casperlabs.comm.discovery.Node.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.io.casperlabs.comm.discovery.Node;
  return proto.io.casperlabs.comm.discovery.Node.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.io.casperlabs.comm.discovery.Node} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.io.casperlabs.comm.discovery.Node}
 */
proto.io.casperlabs.comm.discovery.Node.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setHost(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setProtocolPort(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDiscoveryPort(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setChainId(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.io.casperlabs.comm.discovery.Node} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.io.casperlabs.comm.discovery.Node.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.io.casperlabs.comm.discovery.Node.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getHost();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getProtocolPort();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getDiscoveryPort();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getChainId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = this.getNodeVersion();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.io.casperlabs.comm.discovery.Node} The clone.
 */
proto.io.casperlabs.comm.discovery.Node.prototype.cloneMessage = function() {
  return /** @type {!proto.io.casperlabs.comm.discovery.Node} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/** @param {!(string|Uint8Array)} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string host = 2;
 * @return {string}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getHost = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setHost = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 protocol_port = 3;
 * @return {number}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getProtocolPort = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setProtocolPort = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 discovery_port = 4;
 * @return {number}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getDiscoveryPort = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setDiscoveryPort = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional bytes chain_id = 5;
 * @return {!(string|Uint8Array)}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getChainId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/**
 * optional bytes chain_id = 5;
 * This is a type-conversion wrapper around `getChainId()`
 * @return {string}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getChainId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getChainId()));
};


/**
 * optional bytes chain_id = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChainId()`
 * @return {!Uint8Array}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getChainId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getChainId()));
};


/** @param {!(string|Uint8Array)} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setChainId = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string node_version = 6;
 * @return {string}
 */
proto.io.casperlabs.comm.discovery.Node.prototype.getNodeVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 6, ""));
};


/** @param {string} value  */
proto.io.casperlabs.comm.discovery.Node.prototype.setNodeVersion = function(value) {
  jspb.Message.setField(this, 6, value);
};


goog.object.extend(exports, proto.io.casperlabs.comm.discovery);
