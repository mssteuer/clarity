import { concat } from '@ethersproject/bytes';
import {
  toBytesArrayU8,
  toBytesBytesArray,
  toBytesNumber,
  toBytesString,
  toBytesStringList,
  toBytesU32,
  toBytesVecT
} from './byterepr';
import { BigNumberish } from '@ethersproject/bignumber';
import { URef } from './uref';
import { decodeBase16, encodeBase16 } from './Conversions';
import { Option } from './option';
import { byteHash } from './Contracts';
import { SignatureAlgorithm } from './Keys';

type ByteArray = Uint8Array;

export interface CLTyped {
  clType: () => CLType;
}

export interface ToBytes {
  toBytes: () => ByteArray;
}

export abstract class CLTypedAndToBytes implements ToBytes, CLTyped {
  abstract clType(): CLType;

  abstract toBytes(): ByteArray;

  clTypeEncoded(): ByteArray {
    return CLTypeHelper.toBytesHelper(this.clType());
  }
}

export enum SimpleType {
  Bool = 0,
  I32 = 1,
  I64 = 2,
  U8 = 3,
  U32 = 4,
  U64 = 5,
  U128 = 6,
  U256 = 7,
  U512 = 8,
  Unit = 9,
  String = 10,
  Key = 11,
  URef = 12,
  PublicKey = 22
}

class Bool extends CLTypedAndToBytes {
  constructor(private b: boolean) {
    super();
  }
  toBytes(): ByteArray {
    return new Uint8Array([this.b ? 1 : 0]);
  }
  clType(): CLType {
    return SimpleType.Bool;
  }
}

abstract class NumberCoder extends CLTypedAndToBytes {
  bitSize: number;
  signed: boolean;
  value: BigNumberish;
  name: string;

  protected constructor(bitSize: number, signed: boolean, value: BigNumberish) {
    super();
    this.name = (signed ? 'i' : 'u') + bitSize;
    this.bitSize = bitSize;
    this.signed = signed;
    this.value = value;
  }

  toBytes = (): ByteArray => {
    return toBytesNumber(this.bitSize, this.signed, this.value);
  };

  abstract clType(): CLType;
}

class U8 extends NumberCoder {
  constructor(u8: number) {
    super(8, false, u8);
  }
  clType(): CLType {
    return SimpleType.U8;
  }
}

export class U32 extends NumberCoder {
  constructor(n: number) {
    super(32, false, n);
  }
  clType(): CLType {
    return SimpleType.U32;
  }
}

class I32 extends NumberCoder {
  constructor(n: number) {
    super(32, true, n);
  }
  clType(): CLType {
    return SimpleType.I32;
  }
}

class U64 extends NumberCoder {
  constructor(n: BigNumberish) {
    super(64, false, n);
  }

  clType(): CLType {
    return SimpleType.U64;
  }
}

class I64 extends NumberCoder {
  constructor(n: BigNumberish) {
    super(64, true, n);
  }

  clType(): CLType {
    return SimpleType.I64;
  }
}

class U128 extends NumberCoder {
  constructor(n: BigNumberish) {
    super(128, false, n);
  }

  clType(): CLType {
    return SimpleType.U128;
  }
}

class U256 extends NumberCoder {
  constructor(n: BigNumberish) {
    super(256, false, n);
  }

  clType(): CLType {
    return SimpleType.U256;
  }
}

class U512 extends NumberCoder {
  constructor(n: BigNumberish) {
    super(512, false, n);
  }

  clType(): CLType {
    return SimpleType.U512;
  }
}

class Unit extends CLTypedAndToBytes {
  clType(): CLType {
    return SimpleType.Unit;
  }

  toBytes(): ByteArray {
    return Uint8Array.from([]);
  }
}

class StringValue extends CLTypedAndToBytes {
  constructor(private str: string) {
    super();
  }
  toBytes = () => {
    return toBytesString(this.str);
  };

  clType(): CLType {
    return SimpleType.String;
  }
}

class List<T extends CLTypedAndToBytes> extends CLTypedAndToBytes {
  constructor(private vec: T[]) {
    super();
    if (vec.length === 0) {
      throw new Error("Can't create instance for empty list");
    }
  }

  clType(): CLType {
    return CLTypeHelper.list(this.vec[0].clType());
  }

  toBytes(): ByteArray {
    return toBytesVecT(this.vec);
  }
}

class Tuple1 extends CLTypedAndToBytes {
  constructor(private v0: CLTypedAndToBytes) {
    super();
  }

  toBytes(): ByteArray {
    return this.v0.toBytes();
  }

  clType(): CLType {
    return CLTypeHelper.tuple1(this.v0.clType());
  }
}

class Tuple2 extends CLTypedAndToBytes {
  constructor(private v0: CLTypedAndToBytes, private v1: CLTypedAndToBytes) {
    super();
  }

  toBytes(): ByteArray {
    return concat([this.v0.toBytes(), this.v1.toBytes()]);
  }

  clType(): CLType {
    return CLTypeHelper.tuple2(this.v0.clType(), this.v1.clType());
  }
}

class Tuple3 extends CLTypedAndToBytes {
  constructor(
    private v0: CLTypedAndToBytes,
    private v1: CLTypedAndToBytes,
    private v2: CLTypedAndToBytes
  ) {
    super();
  }

  clType(): CLType {
    return CLTypeHelper.tuple3(
      this.v0.clType(),
      this.v1.clType(),
      this.v2.clType()
    );
  }

  toBytes(): ByteArray {
    return concat([this.v0.toBytes(), this.v1.toBytes(), this.v2.toBytes()]);
  }
}

export class PublicKey extends CLTypedAndToBytes {
  private constructor(public rawPublicKey: ByteArray, private tag: number) {
    super();
  }
  clType(): CLType {
    return SimpleType.PublicKey;
  }

  toBytes(): ByteArray {
    return concat([
      Uint8Array.from([this.tag]),
      toBytesBytesArray(this.rawPublicKey)
    ]);
  }

  toAccountHex(): string {
    let accountHash: string;
    switch (this.tag) {
      case 1:
        accountHash = '01' + encodeBase16(this.rawPublicKey);
        break;
      default:
        throw new Error('Unsupported type of public key');
    }
    return accountHash;
  }

  toAccountHash(): ByteArray {
    switch (this.tag) {
      case 1:
        const separator = Buffer.from([0]);
        const prefix = Buffer.concat([
          Buffer.from('ed25519'.toLowerCase()),
          separator
        ]);

        if (this.rawPublicKey.length === 0) {
          return Buffer.from([]);
        } else {
          return byteHash(
            Buffer.concat([prefix, Buffer.from(this.rawPublicKey)])
          );
        }
      default:
        throw new Error('Unsupported type of public key');
    }
  }

  static fromEd25519(publicKey: ByteArray) {
    return new PublicKey(publicKey, 1);
  }

  static from(publicKey: ByteArray, signatureAlgorithm: SignatureAlgorithm) {
    switch (signatureAlgorithm) {
      case SignatureAlgorithm.Ed25519:
        return PublicKey.fromEd25519(publicKey);
      default:
        throw new Error('Unsupported type of public key');
    }
  }

  /**
   * Tries to decode PublicKey from its hex-representation.
   * The hex format should be as produced by PublicKey.toAccountHex
   * @param publicKeyHex
   */
  static fromHex(publicKeyHex: string) {
    if (publicKeyHex.length < 2) {
      throw new Error('asymmetric key error: too short');
    }
    const publicKeyHexBytes = decodeBase16(publicKeyHex);
    switch (publicKeyHexBytes[0]) {
      case 1:
        return PublicKey.fromEd25519(publicKeyHexBytes.subarray(1));
      default:
        throw new Error('Unsupported type of public key');
    }
  }

  signatureAlgorithm() {
    switch (this.tag) {
      case 1:
        return SignatureAlgorithm.Ed25519;
      default:
        throw new Error('Unsupported type of public key');
    }
  }
}

export interface MapEntry {
  key: CLTypedAndToBytes;
  value: CLTypedAndToBytes;
}

class MapValue extends CLTypedAndToBytes {
  constructor(private v: MapEntry[]) {
    super();
  }

  toBytes(): ByteArray {
    const kvBytes: Uint8Array[] = this.v.map(vv => {
      return concat([vv.key.toBytes(), vv.value.toBytes()]);
    });
    kvBytes.splice(0, 0, toBytesU32(this.v.length));
    return concat(kvBytes);
  }

  clType(): CLType {
    return new MapType(this.v[0].key.clType(), this.v[0].value.clType());
  }
}

class OptionType {
  tag = 13;
  constructor(public innerType: CLType) {}
}

class ListType {
  tag = 14;
  innerType: CLType;
  constructor(innerType: CLType) {
    this.innerType = innerType;
  }
}

class ByteArrayType {
  tag = 15;
  constructor(public size: number) {}
}

class MapType {
  tag = 17;
  constructor(public keyType: CLType, public valueType: CLType) {}
}

class Tuple1Type {
  tag = 18;
  constructor(public t0: CLType) {}
}

class Tuple2Type {
  tag = 19;
  constructor(public t0: CLType, public t1: CLType) {}
}

class Tuple3Type {
  tag = 20;
  constructor(public t0: CLType, public t1: CLType, public t2: CLType) {}
}

export type CLType =
  | SimpleType
  | ListType
  | ByteArrayType
  | MapType
  | OptionType
  | Tuple1Type
  | Tuple2Type
  | Tuple3Type;

export class CLTypeHelper {
  static u8() {
    return SimpleType.U8;
  }

  static u32() {
    return SimpleType.U32;
  }

  static u64() {
    return SimpleType.U64;
  }

  static u128() {
    return SimpleType.U128;
  }

  static u256() {
    return SimpleType.U256;
  }

  static u512() {
    return SimpleType.U512;
  }

  static i32() {
    return SimpleType.I32;
  }

  static i64() {
    return SimpleType.I64;
  }

  static bool() {
    return SimpleType.Bool;
  }

  static unit() {
    return SimpleType.Unit;
  }

  static string() {
    return SimpleType.String;
  }

  static key() {
    return SimpleType.Key;
  }

  static publicKey() {
    return SimpleType.PublicKey;
  }

  static uRef() {
    return SimpleType.URef;
  }

  static option(innerType: CLType) {
    return new OptionType(innerType);
  }

  static list(innerType: CLType) {
    return new ListType(innerType);
  }

  static byteArray(len: number) {
    return new ByteArrayType(len);
  }

  static map(keyType: CLType, valueType: CLType) {
    return new MapType(keyType, valueType);
  }

  static tuple1(t0: CLType) {
    return new Tuple1Type(t0);
  }

  static tuple2(t0: CLType, t1: CLType) {
    return new Tuple2Type(t0, t1);
  }

  static tuple3(t0: CLType, t1: CLType, t2: CLType) {
    return new Tuple3Type(t0, t1, t2);
  }

  static toBytesHelper(type: CLType): ByteArray {
    if (type instanceof ListType) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.innerType)
      ]);
    } else if (type instanceof Tuple1Type) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.t0)
      ]);
    } else if (type instanceof Tuple2Type) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.t0),
        CLTypeHelper.toBytesHelper(type.t1)
      ]);
    } else if (type instanceof Tuple3Type) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.t0),
        CLTypeHelper.toBytesHelper(type.t1),
        CLTypeHelper.toBytesHelper(type.t2)
      ]);
    } else if (type instanceof ByteArrayType) {
      return concat([Uint8Array.from([type.tag]), toBytesU32(type.size)]);
    } else if (type instanceof MapType) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.keyType),
        CLTypeHelper.toBytesHelper(type.valueType)
      ]);
    } else if (type instanceof OptionType) {
      return concat([
        Uint8Array.from([type.tag]),
        CLTypeHelper.toBytesHelper(type.innerType)
      ]);
    } else {
      switch (type) {
        case SimpleType.Bool:
        case SimpleType.I32:
        case SimpleType.I64:
        case SimpleType.U8:
        case SimpleType.U32:
        case SimpleType.U64:
        case SimpleType.U128:
        case SimpleType.U256:
        case SimpleType.U512:
        case SimpleType.Unit:
        case SimpleType.String:
        case SimpleType.Key:
        case SimpleType.URef:
        case SimpleType.PublicKey:
          return Uint8Array.from([type]);
        default:
          throw new Error('Wrong type');
      }
    }
  }
}

class ByteArrayValue extends CLTypedAndToBytes {
  constructor(private bytes: ByteArray) {
    super();
  }

  clType(): CLType {
    return CLTypeHelper.byteArray(this.bytes.length);
  }

  toBytes(): ByteArray {
    return toBytesBytesArray(this.bytes);
  }
}

export class CLTypedAndToBytesHelper {
  static bool = (b: boolean) => {
    return new Bool(b);
  };

  static u8 = (u8: number) => {
    return new U8(u8);
  };

  static u32 = (u32: number) => {
    return new U32(u32);
  };

  static i32 = (i32: number) => {
    return new I32(i32);
  };

  static u64 = (u64: BigNumberish) => {
    return new U64(u64);
  };

  static i64 = (i64: BigNumberish) => {
    return new I64(i64);
  };

  static u128 = (u128: BigNumberish) => {
    return new U128(u128);
  };

  static u256 = (u256: BigNumberish) => {
    return new U256(u256);
  };

  static u512 = (u512: BigNumberish) => {
    return new U512(u512);
  };

  static unit = () => {
    return new Unit();
  };

  static string = (x: string) => {
    return new StringValue(x);
  };

  static list<T extends CLTypedAndToBytes>(vec: T[]) {
    // todo(abner) implement fromEmptyList
    return new List(vec);
  }

  static tuple1<T extends CLTypedAndToBytes>(t0: T) {
    return new Tuple1(t0);
  }

  static tuple2<T extends CLTypedAndToBytes>(t0: T, t1: T) {
    return new Tuple2(t0, t1);
  }

  static tuple3<T extends CLTypedAndToBytes>(t0: T, t1: T, t2: T) {
    return new Tuple3(t0, t1, t2);
  }

  static map(mapEntries: MapEntry[]) {
    return new MapValue(mapEntries);
  }

  static publicKey(publicKey: ByteArray) {
    return PublicKey.fromEd25519(publicKey);
  }

  static bytes(bytes: ByteArray) {
    return new ByteArrayValue(bytes);
  }
}

/**
 * A Casper value, i.e. a value which can be stored and manipulated by smart contracts.
 *
 * It holds the underlying data as a type-erased, serialized array of bytes and also holds the
 * [[CLType]] of the underlying data as a separate member.
 */
export class CLValue implements ToBytes {
  /**
   * Please use static methods to constructs a new `CLValue`
   */
  private constructor(private bytes: ByteArray, private clType: CLType) {}

  static fromT<T extends CLTypedAndToBytes>(v: T) {
    return new CLValue(v.toBytes(), v.clType());
  }

  /**
   * Serializes a `CLValue` into an array of bytes.
   */
  toBytes() {
    return concat([
      toBytesArrayU8(this.bytes),
      CLTypeHelper.toBytesHelper(this.clType)
    ]);
  }

  static fromBool = (b: boolean) => {
    return CLValue.fromT(new Bool(b));
  };

  static fromU8 = (u8: number) => {
    return CLValue.fromT(new U8(u8));
  };

  static fromU32 = (u32: number) => {
    return CLValue.fromT(new U32(u32));
  };

  static fromI32 = (i32: number) => {
    return CLValue.fromT(new I32(i32));
  };

  static fromU64 = (u64: BigNumberish) => {
    return CLValue.fromT(new U64(u64));
  };

  static fromI64 = (i64: BigNumberish) => {
    return CLValue.fromT(new I64(i64));
  };

  static fromU128 = (u128: BigNumberish) => {
    return CLValue.fromT(new U128(u128));
  };

  static fromU256 = (u256: BigNumberish) => {
    return CLValue.fromT(new U256(u256));
  };

  static fromU512 = (u512: BigNumberish) => {
    return CLValue.fromT(new U512(u512));
  };

  static fromUnit = () => {
    return CLValue.fromT(new Unit());
  };

  static fromString = (x: string) => {
    return CLValue.fromT(new StringValue(x));
  };

  static fromKey = (key: KeyValue) => {
    return CLValue.fromT(key);
  };

  static fromURef = (uRef: URef) => {
    return CLValue.fromT(uRef);
  };

  static fromStringList = (strings: string[]) => {
    return new CLValue(
      toBytesStringList(strings),
      CLTypeHelper.list(SimpleType.String)
    );
  };

  static fromList<T extends CLTypedAndToBytes>(vec: T[]) {
    return CLValue.fromT(new List(vec));
  }

  static fromTuple1<T extends CLTypedAndToBytes>(t0: T) {
    return CLValue.fromT(new Tuple1(t0));
  }

  static fromTuple2<T extends CLTypedAndToBytes>(t0: T, t1: T) {
    return CLValue.fromT(new Tuple2(t0, t1));
  }

  static fromTuple3<T extends CLTypedAndToBytes>(t0: T, t1: T, t2: T) {
    return CLValue.fromT(new Tuple3(t0, t1, t2));
  }

  static fromOption(t: CLTypedAndToBytes | null, innerType?: CLType) {
    return CLValue.fromT(new Option(t, innerType));
  }

  static fromMap(mapEntries: MapEntry[]) {
    return CLValue.fromT(new MapValue(mapEntries));
  }

  static fromPublicKey(publicKey: ByteArray) {
    return CLValue.fromT(PublicKey.fromEd25519(publicKey));
  }

  static fromBytes(bytes: ByteArray) {
    return new CLValue(
      toBytesBytesArray(bytes),
      CLTypeHelper.byteArray(bytes.byteLength)
    );
  }
}

export enum KeyVariant {
  /** The Account variant */
  ACCOUNT_ID = 0,
  /** The Hash variant */
  HASH_ID = 1,
  /** The URef variant */
  UREF_ID = 2
}

/// The length in bytes of a [`AccountHash`].
const ACCOUNT_HASH_LENGTH: number = 32;

/** A cryptographic public key. */
export class AccountHash extends CLTypedAndToBytes {
  /**
   * Constructs a new `AccountHash`.
   *
   * @param bytes The bytes constituting the public key.
   */
  constructor(public bytes: Uint8Array) {
    super();
  }

  /** Serializes a `AccountHash` into an array of bytes. */
  toBytes(): Uint8Array {
    return this.bytes;
  }

  clType(): CLType {
    return CLTypeHelper.byteArray(ACCOUNT_HASH_LENGTH);
  }
}

/**
 * The type under which data (e.g. [[CLValue]]s, smart contracts, user accounts)
 * are indexed on the network.
 */
export class KeyValue extends CLTypedAndToBytes {
  variant: KeyVariant;
  hash: Uint8Array | null;
  uRef: URef | null;
  account: AccountHash | null;

  /** Creates a `Key` from a given [[URef]]. */
  static fromURef(uref: URef): KeyValue {
    const key = new KeyValue();
    key.variant = KeyVariant.UREF_ID;
    key.uRef = uref;
    return key;
  }

  /** Creates a `Key` from a given hash. */
  static fromHash(hash: Uint8Array): KeyValue {
    const key = new KeyValue();
    key.variant = KeyVariant.HASH_ID;
    key.hash = hash;
    return key;
  }

  /** Creates a `Key` from a [[<AccountHash>]] representing an account. */
  static fromAccount(account: AccountHash): KeyValue {
    const key = new KeyValue();
    key.variant = KeyVariant.ACCOUNT_ID;
    key.account = account;
    return key;
  }

  clType() {
    return SimpleType.Key;
  }

  /** Serializes a `Key` into an array of bytes. */
  toBytes() {
    if (this.variant === KeyVariant.ACCOUNT_ID) {
      return concat([Uint8Array.from([this.variant]), this.account!.toBytes()]);
    } else if (this.variant === KeyVariant.HASH_ID) {
      return concat([Uint8Array.from([this.variant]), this.hash!]);
    } else if (this.variant === KeyVariant.UREF_ID) {
      return concat([Uint8Array.from([this.variant]), this.uRef!.toBytes()]);
    } else {
      throw new Error('Unknown variant');
    }
  }
}
