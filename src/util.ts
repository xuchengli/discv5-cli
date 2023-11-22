import fs  = require("fs");
import { PeerId } from "@libp2p/interface/peer-id";
import { createSecp256k1PeerId, createFromJSON } from "@libp2p/peer-id-factory";
import { BindAddrs, ENR, SignableENR } from "@chainsafe/discv5";
import { multiaddr } from "@multiformats/multiaddr";

export async function createPeerId(): Promise<PeerId> {
  return createSecp256k1PeerId();
}

export async function readPeerId(peerIdFile: string): Promise<PeerId> {
  return createFromJSON(JSON.parse(fs.readFileSync(peerIdFile, "utf-8")));
}

export function writePeerId(peerIdFile: string, peerId: PeerId): void {
  return fs.writeFileSync(peerIdFile, JSON.stringify(peerId.toString(), null, 2));
}

export function createEnr(peerId: PeerId): ENR {
  return SignableENR.createFromPeerId(peerId).toENR();
}

export function readEnr(enrFile: string): string {
  return fs.readFileSync(enrFile, "utf-8").trim();
}

export function writeEnr(enrFile: string, enr: ENR): void {
  return fs.writeFileSync(enrFile, enr.encodeTxt());
}

export function readEnrs(filename: string): ENR[] {
  return fs.readFileSync(filename, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((str) => ENR.decodeTxt(str));
}

export function writeEnrs(filename: string, enrs: ENR[]): void {
  fs.writeFileSync(filename, enrs.map((enr) => enr.encodeTxt()).join("\n"));
}

export function getBindAddress(addr: string): BindAddrs {
  const mu = multiaddr(addr);
  const protoNames = mu.protoNames();
  if (protoNames.length !== 2 || protoNames[1] !== "udp") {
    throw new Error("Invalid bind address, must be a udp multiaddr");
  }
  return {
    ip4: mu,
  };
}
