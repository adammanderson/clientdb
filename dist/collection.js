function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

import intersectionWith from 'lodash/intersectionWith';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import uniqWith from 'lodash/uniqWith';
import Cluster from './cluster';

class Collection {
  constructor(options) {
    _listeners.set(this, {
      writable: true,
      value: void 0
    });

    this.name = options.name;
    this.docs = [];
    this.schema = options.schema;

    _classPrivateFieldSet(this, _listeners, []);
  }

  add(data) {
    const intersected = intersectionWith(this.docs, [data], isEqual);

    if (intersected.length) {
      throw new Error('Current object already present in this collection');
    }

    this.docs = [...this.docs, data];

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs
    };
  }

  bulkAdd(data) {
    const intersected = intersectionWith(this.docs, [data], isEqual);
    data = uniqWith([...intersected, ...data]);
    this.docs = [...this.docs, ...data];

    if (intersected.length) {
      return {
        docs: this.docs,
        status: 'added with warnings',
        warning: 'Some data was not added because it is already in collection'
      };
    }

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs,
      status: 'success'
    };
  }

  getAll() {
    return new Cluster(this.docs);
  }

  where(options) {
    const docs = filter(this.docs, options);
    return new Cluster(docs, options);
  }

  update(query, data) {
    const field = find(this.docs, query);

    if (!field) {
      throw new Error('Current object is not in this collection');
    }

    const uniqData = uniqWith([...this.docs, field]);
    const updatedField = { ...field,
      ...data
    };
    this.docs = [...uniqData, updatedField];

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs
    };
  }

  bulkUpdate(data) {
    this.docs = this.docs.map(doc => ({ ...doc,
      data
    }));

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs,
      status: 'success'
    };
  }

  upsert(data) {
    const unique_data = uniqWith([...this.docs, data], isEqual);
    this.docs = [...unique_data, data];

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs
    };
  }

  bulkUpsert(data) {
    const unique_data = uniqWith([...this.docs, ...data], isEqual);
    this.docs = [...unique_data, data];

    _classPrivateFieldGet(this, _listeners).forEach(listener => {
      listener(this.docs);
    });

    return {
      docs: this.docs
    };
  }

  subscribe(cb) {
    _classPrivateFieldGet(this, _listeners).push(cb);

    return () => {
      _classPrivateFieldGet(this, _listeners).delete(cb);
    };
  }

}

var _listeners = new WeakMap();

export default Collection;