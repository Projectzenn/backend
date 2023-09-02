export const FileCollection = `@public
collection File {
  id: string;
  publicKey: PublicKey;
  hash: string;
  name: string;
  source: string;
  address: string;
  created: number;

  constructor (id: string, hash: string, name: string, source: string, address:string, created: number) {
    this.id = id;
    this.hash = hash;
    this.name = name;
    this.source = source;
    this.address = address
    this.created = created;


    this.publicKey = ctx.publicKey;
  }
  @index(address, source);

  deleteFile() {
    if (this.publicKey != ctx.publicKey) {
      throw error('invalid public key');
    }
    selfdestruct();
  }
}`;
