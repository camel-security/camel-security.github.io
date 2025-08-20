import { CaMeLValue } from '../types/camel';

export class CaMeLValueClass implements CaMeLValue {
  value: any;
  readers: string[];
  sources: string[];
  capabilities?: string[];

  constructor(
    value: any,
    readers: string[] = ['user'],
    sources: string[] = ['user'],
    capabilities?: string[]
  ) {
    this.value = value;
    this.readers = readers;
    this.sources = sources;
    this.capabilities = capabilities;
  }

  canRead(reader: string): boolean {
    return this.readers.includes(reader) || this.readers.includes('*');
  }

  isTrusted(): boolean {
    return !this.sources.some(source => 
      source.includes('untrusted') || 
      source.includes('external') || 
      source.includes('q-llm')
    );
  }

  merge(other: CaMeLValue): CaMeLValueClass {
    const mergedReaders = Array.from(new Set([...this.readers, ...other.readers]));
    const mergedSources = Array.from(new Set([...this.sources, ...other.sources]));
    return new CaMeLValueClass(
      this.value,
      mergedReaders,
      mergedSources,
      this.capabilities
    );
  }

  withCapabilities(capabilities: string[]): CaMeLValueClass {
    return new CaMeLValueClass(
      this.value,
      this.readers,
      this.sources,
      capabilities
    );
  }

  toString(): string {
    return JSON.stringify({
      value: this.value,
      readers: this.readers,
      sources: this.sources,
      capabilities: this.capabilities
    }, null, 2);
  }
}