
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/tailwindui/Icon.svelte generated by Svelte v3.48.0 */

    const file$c = "src/tailwindui/Icon.svelte";

    // (26:26) 
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z");
    			add_location(path, file$c, 28, 12, 1934);
    			attr_dev(svg, "class", "w-5 h-5");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 27, 10, 1806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(26:26) ",
    		ctx
    	});

    	return block;
    }

    // (21:28) 
    function create_if_block_3$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$c, 23, 8, 1538);
    			attr_dev(svg, "class", "h-5 w-5");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 22, 4, 1414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(21:28) ",
    		ctx
    	});

    	return block;
    }

    // (16:26) 
    function create_if_block_2$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9");
    			add_location(path, file$c, 18, 8, 1079);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 17, 4, 924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(16:26) ",
    		ctx
    	});

    	return block;
    }

    // (11:26) 
    function create_if_block_1$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4 6h16M4 12h16M4 18h7");
    			add_location(path, file$c, 13, 4, 760);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 12, 2, 609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(11:26) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if kind === 'home'}
    function create_if_block$4(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6");
    			add_location(path, file$c, 8, 8, 319);
    			attr_dev(svg, "class", "mr-4 flex-shrink-0 h-6 w-6 text-indigo-300");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 7, 4, 129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(6:0) {#if kind === 'home'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*kind*/ ctx[0] === 'home') return create_if_block$4;
    		if (/*kind*/ ctx[0] === "menu") return create_if_block_1$3;
    		if (/*kind*/ ctx[0] === "bell") return create_if_block_2$2;
    		if (/*kind*/ ctx[0] === "search") return create_if_block_3$2;
    		if (/*kind*/ ctx[0] === "dots") return create_if_block_4$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { kind } = $$props;
    	let { size } = $$props;
    	const writable_props = ['kind', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ kind, size });

    	$$self.$inject_state = $$props => {
    		if ('kind' in $$props) $$invalidate(0, kind = $$props.kind);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [kind, size];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { kind: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*kind*/ ctx[0] === undefined && !('kind' in props)) {
    			console.warn("<Icon> was created without expected prop 'kind'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Icon> was created without expected prop 'size'");
    		}
    	}

    	get kind() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/tailwindui/MenuButton.svelte generated by Svelte v3.48.0 */

    const file$b = "src/tailwindui/MenuButton.svelte";

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let button;
    	let span;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div1;
    	let a0;
    	let t4;
    	let a1;
    	let t6;
    	let a2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Open user menu";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Your Profile";
    			t4 = space();
    			a1 = element("a");
    			a1.textContent = "Settings";
    			t6 = space();
    			a2 = element("a");
    			a2.textContent = "Sign out";
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$b, 4, 20, 365);
    			attr_dev(img, "class", "h-8 w-8 rounded-full");
    			if (!src_url_equal(img.src, img_src_value = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$b, 5, 20, 429);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			attr_dev(button, "id", "user-menu-button");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-haspopup", "true");
    			add_location(button, file$b, 3, 18, 118);
    			add_location(div0, file$b, 2, 16, 94);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "block px-4 py-2 text-sm text-gray-700");
    			attr_dev(a0, "role", "menuitem");
    			attr_dev(a0, "tabindex", "-1");
    			attr_dev(a0, "id", "user-menu-item-0");
    			add_location(a0, file$b, 21, 18, 1483);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "block px-4 py-2 text-sm text-gray-700");
    			attr_dev(a1, "role", "menuitem");
    			attr_dev(a1, "tabindex", "-1");
    			attr_dev(a1, "id", "user-menu-item-1");
    			add_location(a1, file$b, 23, 18, 1633);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "block px-4 py-2 text-sm text-gray-700");
    			attr_dev(a2, "role", "menuitem");
    			attr_dev(a2, "tabindex", "-1");
    			attr_dev(a2, "id", "user-menu-item-2");
    			add_location(a2, file$b, 25, 18, 1779);
    			attr_dev(div1, "class", "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none");
    			attr_dev(div1, "role", "menu");
    			attr_dev(div1, "aria-orientation", "vertical");
    			attr_dev(div1, "aria-labelledby", "user-menu-button");
    			attr_dev(div1, "tabindex", "-1");
    			add_location(div1, file$b, 19, 16, 1166);
    			attr_dev(div2, "class", "ml-3 relative");
    			add_location(div2, file$b, 1, 12, 50);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(button, span);
    			append_dev(button, t1);
    			append_dev(button, img);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(div1, t6);
    			append_dev(div1, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuButton', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuButton> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MenuButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuButton",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/tailwindui/SearchForm.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$a = "src/tailwindui/SearchForm.svelte";

    function create_fragment$c(ctx) {
    	let form;
    	let label;
    	let t1;
    	let div1;
    	let div0;
    	let icon;
    	let t2;
    	let input;
    	let t3;
    	let ul2;
    	let li2;
    	let h20;
    	let t5;
    	let ul0;
    	let li0;
    	let t7;
    	let li1;
    	let t9;
    	let li5;
    	let h21;
    	let t11;
    	let ul1;
    	let li3;
    	let t13;
    	let li4;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { kind: "search" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			label = element("label");
    			label.textContent = "Search";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			ul2 = element("ul");
    			li2 = element("li");
    			h20 = element("h2");
    			h20.textContent = "Clients";
    			t5 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Workflow Inc.";
    			t7 = space();
    			li1 = element("li");
    			li1.textContent = "Multinational LLC.";
    			t9 = space();
    			li5 = element("li");
    			h21 = element("h2");
    			h21.textContent = "Projects";
    			t11 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Workflow Inc. / Website Redesign";
    			t13 = space();
    			li4 = element("li");
    			li4.textContent = "Multinational LLC. / Animation";
    			attr_dev(label, "for", "search-field");
    			attr_dev(label, "class", "sr-only");
    			add_location(label, file$a, 11, 4, 226);
    			attr_dev(div0, "class", "absolute inset-y-0 left-0 flex items-center pointer-events-none");
    			add_location(div0, file$a, 13, 6, 364);
    			attr_dev(input, "class", "block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "name", "search");
    			add_location(input, file$a, 16, 6, 493);
    			attr_dev(div1, "class", "relative w-full text-gray-400 focus-within:text-gray-600");
    			add_location(div1, file$a, 12, 4, 287);
    			attr_dev(form, "class", "w-full flex md:ml-0");
    			add_location(form, file$a, 10, 0, 147);
    			attr_dev(h20, "class", "bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900");
    			add_location(h20, file$a, 22, 4, 898);
    			attr_dev(li0, "class", "cursor-default select-none px-4 py-2");
    			attr_dev(li0, "id", "option-1");
    			attr_dev(li0, "role", "option");
    			attr_dev(li0, "tabindex", "-1");
    			add_location(li0, file$a, 25, 6, 1083);
    			attr_dev(li1, "class", "cursor-default select-none px-4 py-2");
    			attr_dev(li1, "id", "option-2");
    			attr_dev(li1, "role", "option");
    			attr_dev(li1, "tabindex", "-1");
    			add_location(li1, file$a, 26, 6, 1199);
    			attr_dev(ul0, "class", "mt-2 text-sm text-gray-800");
    			add_location(ul0, file$a, 23, 4, 987);
    			add_location(li2, file$a, 21, 2, 889);
    			attr_dev(h21, "class", "bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900");
    			add_location(h21, file$a, 30, 4, 1343);
    			attr_dev(li3, "class", "cursor-default select-none px-4 py-2");
    			attr_dev(li3, "id", "option-3");
    			attr_dev(li3, "role", "option");
    			attr_dev(li3, "tabindex", "-1");
    			add_location(li3, file$a, 33, 6, 1529);
    			attr_dev(li4, "class", "cursor-default select-none px-4 py-2");
    			attr_dev(li4, "id", "option-3");
    			attr_dev(li4, "role", "option");
    			attr_dev(li4, "tabindex", "-1");
    			add_location(li4, file$a, 34, 6, 1664);
    			attr_dev(ul1, "class", "mt-2 text-sm text-gray-800");
    			add_location(ul1, file$a, 31, 4, 1433);
    			add_location(li5, file$a, 29, 2, 1334);
    			attr_dev(ul2, "class", "max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2");
    			attr_dev(ul2, "id", "options");
    			attr_dev(ul2, "role", "listbox");
    			add_location(ul2, file$a, 20, 0, 781);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, label);
    			append_dev(form, t1);
    			append_dev(form, div1);
    			append_dev(div1, div0);
    			mount_component(icon, div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			set_input_value(input, /*query*/ ctx[0]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, ul2, anchor);
    			append_dev(ul2, li2);
    			append_dev(li2, h20);
    			append_dev(li2, t5);
    			append_dev(li2, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t7);
    			append_dev(ul0, li1);
    			append_dev(ul2, t9);
    			append_dev(ul2, li5);
    			append_dev(li5, h21);
    			append_dev(li5, t11);
    			append_dev(li5, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t13);
    			append_dev(ul1, li4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*query*/ 1) {
    				set_input_value(input, /*query*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(icon);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(ul2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchForm', slots, []);
    	let query;
    	let results = [];

    	function handleSubmit(ev) {
    		console.log({ query });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SearchForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		query = this.value;
    		$$invalidate(0, query);
    	}

    	$$self.$capture_state = () => ({ Icon, query, results, handleSubmit });

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(0, query = $$props.query);
    		if ('results' in $$props) results = $$props.results;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [query, handleSubmit, input_input_handler];
    }

    class SearchForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchForm",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/tailwindui/AppShell.svelte generated by Svelte v3.48.0 */
    const file$9 = "src/tailwindui/AppShell.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].text;
    	child_ctx[9] = list[i].link;
    	child_ctx[10] = list[i].icon;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].text;
    	child_ctx[9] = list[i].link;
    	child_ctx[10] = list[i].icon;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (14:4) {#if isNavDrawerOpen}
    function create_if_block_3$1(ctx) {
    	let div7;
    	let div0;
    	let t0;
    	let div6;
    	let div4;
    	let div1;
    	let button;
    	let span;
    	let t2;
    	let svg;
    	let path;
    	let t3;
    	let div2;
    	let a;
    	let t5;
    	let div3;
    	let nav;
    	let t6;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*sidebarItems*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Close sidebar";
    			t2 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			a = element("a");
    			a.textContent = "LearnAwesome";
    			t5 = space();
    			div3 = element("div");
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div5 = element("div");
    			attr_dev(div0, "class", "fixed inset-0 bg-gray-600 bg-opacity-75");
    			add_location(div0, file$9, 25, 6, 841);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$9, 51, 14, 2020);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file$9, 54, 16, 2299);
    			attr_dev(svg, "class", "h-6 w-6 text-white");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$9, 53, 14, 2125);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white");
    			add_location(button, file$9, 50, 12, 1808);
    			attr_dev(div1, "class", "absolute top-0 right-0 -mr-12 pt-2");
    			add_location(div1, file$9, 49, 10, 1747);
    			attr_dev(a, "href", "#/");
    			attr_dev(a, "class", "");
    			add_location(a, file$9, 60, 12, 2516);
    			attr_dev(div2, "class", "flex-shrink-0 flex items-center px-4");
    			add_location(div2, file$9, 59, 10, 2453);
    			attr_dev(nav, "class", "px-2 space-y-1");
    			add_location(nav, file$9, 63, 12, 2640);
    			attr_dev(div3, "class", "mt-5 flex-1 h-0 overflow-y-auto");
    			add_location(div3, file$9, 62, 10, 2582);
    			attr_dev(div4, "class", "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700");
    			add_location(div4, file$9, 38, 8, 1328);
    			attr_dev(div5, "class", "flex-shrink-0 w-14");
    			attr_dev(div5, "aria-hidden", "true");
    			add_location(div5, file$9, 76, 8, 3154);
    			attr_dev(div6, "class", "fixed inset-0 flex z-40");
    			add_location(div6, file$9, 27, 6, 910);
    			attr_dev(div7, "class", "relative z-40 md:hidden");
    			attr_dev(div7, "role", "dialog");
    			attr_dev(div7, "aria-modal", "true");
    			add_location(div7, file$9, 14, 4, 426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div1);
    			append_dev(div1, button);
    			append_dev(button, span);
    			append_dev(button, t2);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, a);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, nav);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sidebarItems*/ 1) {
    				each_value_1 = /*sidebarItems*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(nav, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(14:4) {#if isNavDrawerOpen}",
    		ctx
    	});

    	return block;
    }

    // (66:14) {#each sidebarItems as { text, link, icon }
    function create_each_block_1$2(ctx) {
    	let a;
    	let icon;
    	let t0;
    	let t1_value = /*text*/ ctx[8] + "";
    	let t1;
    	let t2;
    	let a_href_value;
    	let current;

    	icon = new Icon({
    			props: { kind: /*icon*/ ctx[10] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[9]);
    			attr_dev(a, "class", "w-full bg-indigo-800 text-white group flex items-center px-2 py-2 text-base font-medium rounded-md");
    			add_location(a, file$9, 66, 18, 2856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(icon, a, null);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*sidebarItems*/ 1) icon_changes.kind = /*icon*/ ctx[10];
    			icon.$set(icon_changes);
    			if ((!current || dirty & /*sidebarItems*/ 1) && t1_value !== (t1_value = /*text*/ ctx[8] + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*sidebarItems*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[9])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(66:14) {#each sidebarItems as { text, link, icon }",
    		ctx
    	});

    	return block;
    }

    // (94:12) {#each sidebarItems as { text, link, icon }
    function create_each_block$5(ctx) {
    	let a;
    	let icon;
    	let t0;
    	let t1_value = /*text*/ ctx[8] + "";
    	let t1;
    	let t2;
    	let a_href_value;
    	let current;

    	icon = new Icon({
    			props: { kind: /*icon*/ ctx[10] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[9]);
    			attr_dev(a, "class", "w-full bg-indigo-800 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md");
    			add_location(a, file$9, 94, 16, 4026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(icon, a, null);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*sidebarItems*/ 1) icon_changes.kind = /*icon*/ ctx[10];
    			icon.$set(icon_changes);
    			if ((!current || dirty & /*sidebarItems*/ 1) && t1_value !== (t1_value = /*text*/ ctx[8] + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*sidebarItems*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[9])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(94:12) {#each sidebarItems as { text, link, icon }",
    		ctx
    	});

    	return block;
    }

    // (111:10) {#if showNotificationBell || showProfileMenu}
    function create_if_block$3(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = /*showNotificationBell*/ ctx[1] && create_if_block_2$1(ctx);
    	let if_block1 = /*showProfileMenu*/ ctx[2] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "ml-4 flex items-center md:ml-6");
    			add_location(div, file$9, 111, 10, 4857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showNotificationBell*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*showNotificationBell*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*showProfileMenu*/ ctx[2]) {
    				if (if_block1) {
    					if (dirty & /*showProfileMenu*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(111:10) {#if showNotificationBell || showProfileMenu}",
    		ctx
    	});

    	return block;
    }

    // (113:12) {#if showNotificationBell}
    function create_if_block_2$1(ctx) {
    	let button;
    	let span;
    	let t1;
    	let icon;
    	let current;
    	icon = new Icon({ props: { kind: "bell" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			span.textContent = "View notifications";
    			t1 = space();
    			create_component(icon.$$.fragment);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$9, 114, 14, 5132);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$9, 113, 12, 4953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(button, t1);
    			mount_component(icon, button, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(113:12) {#if showNotificationBell}",
    		ctx
    	});

    	return block;
    }

    // (120:12) {#if showProfileMenu}
    function create_if_block_1$2(ctx) {
    	let menubutton;
    	let current;
    	menubutton = new MenuButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(menubutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubutton, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(120:12) {#if showProfileMenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div9;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let a;
    	let t2;
    	let div1;
    	let nav;
    	let t3;
    	let div8;
    	let div5;
    	let button;
    	let span;
    	let t5;
    	let icon;
    	let t6;
    	let div4;
    	let t7;
    	let main;
    	let div7;
    	let div6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isNavDrawerOpen*/ ctx[3] && create_if_block_3$1(ctx);
    	let each_value = /*sidebarItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icon = new Icon({ props: { kind: "menu" }, $$inline: true });
    	let if_block1 = (/*showNotificationBell*/ ctx[1] || /*showProfileMenu*/ ctx[2]) && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "LearnAwesome";
    			t2 = space();
    			div1 = element("div");
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div8 = element("div");
    			div5 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Open sidebar";
    			t5 = space();
    			create_component(icon.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			if (if_block1) if_block1.c();
    			t7 = space();
    			main = element("main");
    			div7 = element("div");
    			div6 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "");
    			add_location(a, file$9, 88, 10, 3693);
    			attr_dev(div0, "class", "flex items-center flex-shrink-0 px-4 bg-white");
    			add_location(div0, file$9, 87, 8, 3623);
    			attr_dev(nav, "class", "flex-1 px-2 pb-4 space-y-1");
    			add_location(nav, file$9, 91, 10, 3804);
    			attr_dev(div1, "class", "mt-5 flex-1 flex flex-col");
    			add_location(div1, file$9, 90, 8, 3754);
    			attr_dev(div2, "class", "flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto");
    			add_location(div2, file$9, 86, 6, 3542);
    			attr_dev(div3, "class", "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0");
    			add_location(div3, file$9, 84, 4, 3380);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$9, 106, 10, 4646);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden");
    			add_location(button, file$9, 105, 8, 4441);
    			attr_dev(div4, "class", "flex-1 px-4 flex justify-between");
    			add_location(div4, file$9, 109, 8, 4744);
    			attr_dev(div5, "class", "sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow");
    			add_location(div5, file$9, 104, 6, 4361);
    			attr_dev(div6, "class", "max-w-7xl mx-auto px-4 sm:px-6 md:px-8");
    			add_location(div6, file$9, 127, 10, 5422);
    			attr_dev(div7, "class", "py-6");
    			add_location(div7, file$9, 126, 8, 5393);
    			add_location(main, file$9, 125, 6, 5378);
    			attr_dev(div8, "class", "md:pl-64 flex flex-col flex-1");
    			add_location(div8, file$9, 103, 4, 4311);
    			add_location(div9, file$9, 11, 0, 307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			if (if_block0) if_block0.m(div9, null);
    			append_dev(div9, t0);
    			append_dev(div9, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, nav);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, button);
    			append_dev(button, span);
    			append_dev(button, t5);
    			mount_component(icon, button, null);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div8, t7);
    			append_dev(div8, main);
    			append_dev(main, div7);
    			append_dev(div7, div6);

    			if (default_slot) {
    				default_slot.m(div6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isNavDrawerOpen*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isNavDrawerOpen*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div9, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*sidebarItems*/ 1) {
    				each_value = /*sidebarItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(nav, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*showNotificationBell*/ ctx[1] || /*showProfileMenu*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showNotificationBell, showProfileMenu*/ 6) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon);
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppShell', slots, ['default']);
    	let { sidebarItems = [] } = $$props;
    	let isNavDrawerOpen = false;
    	let { showNotificationBell = false } = $$props;
    	let { showProfileMenu = false } = $$props;
    	const writable_props = ['sidebarItems', 'showNotificationBell', 'showProfileMenu'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppShell> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => $$invalidate(3, isNavDrawerOpen = false);
    	const click_handler_1 = e => $$invalidate(3, isNavDrawerOpen = true);

    	$$self.$$set = $$props => {
    		if ('sidebarItems' in $$props) $$invalidate(0, sidebarItems = $$props.sidebarItems);
    		if ('showNotificationBell' in $$props) $$invalidate(1, showNotificationBell = $$props.showNotificationBell);
    		if ('showProfileMenu' in $$props) $$invalidate(2, showProfileMenu = $$props.showProfileMenu);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		MenuButton,
    		SearchForm,
    		sidebarItems,
    		isNavDrawerOpen,
    		showNotificationBell,
    		showProfileMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('sidebarItems' in $$props) $$invalidate(0, sidebarItems = $$props.sidebarItems);
    		if ('isNavDrawerOpen' in $$props) $$invalidate(3, isNavDrawerOpen = $$props.isNavDrawerOpen);
    		if ('showNotificationBell' in $$props) $$invalidate(1, showNotificationBell = $$props.showNotificationBell);
    		if ('showProfileMenu' in $$props) $$invalidate(2, showProfileMenu = $$props.showProfileMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sidebarItems,
    		showNotificationBell,
    		showProfileMenu,
    		isNavDrawerOpen,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class AppShell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			sidebarItems: 0,
    			showNotificationBell: 1,
    			showProfileMenu: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppShell",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get sidebarItems() {
    		throw new Error("<AppShell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sidebarItems(value) {
    		throw new Error("<AppShell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showNotificationBell() {
    		throw new Error("<AppShell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showNotificationBell(value) {
    		throw new Error("<AppShell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProfileMenu() {
    		throw new Error("<AppShell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProfileMenu(value) {
    		throw new Error("<AppShell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TailwindUI = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Icon: Icon,
        MenuButton: MenuButton,
        AppShell: AppShell
    });

    /* src/Home.svelte generated by Svelte v3.48.0 */

    const file$8 = "src/Home.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let div4;
    	let div0;
    	let h1;
    	let span0;
    	let t1;
    	let span3;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let p;
    	let t7;
    	let div3;
    	let svg0;
    	let defs;
    	let pattern;
    	let rect0;
    	let rect1;
    	let rect2;
    	let t8;
    	let div2;
    	let button;
    	let span4;
    	let t10;
    	let img;
    	let img_src_value;
    	let t11;
    	let div1;
    	let svg1;
    	let circle;
    	let path;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = "Coming soon";
    			t1 = space();
    			span3 = element("span");
    			span1 = element("span");
    			span1.textContent = "Data to enrich your";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "online business";
    			t5 = space();
    			p = element("p");
    			p.textContent = "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua ad ad non deserunt sunt.";
    			t7 = space();
    			div3 = element("div");
    			svg0 = svg_element("svg");
    			defs = svg_element("defs");
    			pattern = svg_element("pattern");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			t8 = space();
    			div2 = element("div");
    			button = element("button");
    			span4 = element("span");
    			span4.textContent = "Watch our video to learn more";
    			t10 = space();
    			img = element("img");
    			t11 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			circle = svg_element("circle");
    			path = svg_element("path");
    			attr_dev(span0, "class", "block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base");
    			add_location(span0, file$8, 4, 10, 230);
    			attr_dev(span1, "class", "block text-gray-900");
    			add_location(span1, file$8, 6, 12, 477);
    			attr_dev(span2, "class", "block text-indigo-600");
    			add_location(span2, file$8, 7, 12, 550);
    			attr_dev(span3, "class", "mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl");
    			add_location(span3, file$8, 5, 10, 376);
    			add_location(h1, file$8, 3, 8, 215);
    			attr_dev(p, "class", "mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl");
    			add_location(p, file$8, 10, 8, 649);
    			attr_dev(div0, "class", "sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left");
    			add_location(div0, file$8, 2, 6, 127);
    			attr_dev(rect0, "x", "0");
    			attr_dev(rect0, "y", "0");
    			attr_dev(rect0, "width", "4");
    			attr_dev(rect0, "height", "4");
    			attr_dev(rect0, "class", "text-gray-200");
    			attr_dev(rect0, "fill", "currentColor");
    			add_location(rect0, file$8, 16, 14, 1411);
    			attr_dev(pattern, "id", "4f4f415c-a0e9-44c2-9601-6ded5a34a13e");
    			attr_dev(pattern, "x", "118");
    			attr_dev(pattern, "y", "0");
    			attr_dev(pattern, "width", "20");
    			attr_dev(pattern, "height", "20");
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			add_location(pattern, file$8, 15, 12, 1278);
    			add_location(defs, file$8, 14, 10, 1259);
    			attr_dev(rect1, "y", "72");
    			attr_dev(rect1, "width", "640");
    			attr_dev(rect1, "height", "640");
    			attr_dev(rect1, "class", "text-gray-50");
    			attr_dev(rect1, "fill", "currentColor");
    			add_location(rect1, file$8, 19, 10, 1546);
    			attr_dev(rect2, "x", "118");
    			attr_dev(rect2, "width", "404");
    			attr_dev(rect2, "height", "784");
    			attr_dev(rect2, "fill", "url(#4f4f415c-a0e9-44c2-9601-6ded5a34a13e)");
    			add_location(rect2, file$8, 20, 10, 1638);
    			attr_dev(svg0, "class", "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 scale-75 origin-top sm:scale-100 lg:hidden");
    			attr_dev(svg0, "width", "640");
    			attr_dev(svg0, "height", "784");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 640 784");
    			attr_dev(svg0, "aria-hidden", "true");
    			add_location(svg0, file$8, 13, 8, 1048);
    			attr_dev(span4, "class", "sr-only");
    			add_location(span4, file$8, 24, 12, 2009);
    			attr_dev(img, "class", "w-full");
    			if (!src_url_equal(img.src, img_src_value = "https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$8, 25, 12, 2080);
    			attr_dev(circle, "opacity", "0.9");
    			attr_dev(circle, "cx", "42");
    			attr_dev(circle, "cy", "42");
    			attr_dev(circle, "r", "42");
    			attr_dev(circle, "fill", "white");
    			add_location(circle, file$8, 28, 16, 2439);
    			attr_dev(path, "d", "M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z");
    			add_location(path, file$8, 29, 16, 2516);
    			attr_dev(svg1, "class", "h-20 w-20 text-indigo-500");
    			attr_dev(svg1, "fill", "currentColor");
    			attr_dev(svg1, "viewBox", "0 0 84 84");
    			add_location(svg1, file$8, 27, 14, 2343);
    			attr_dev(div1, "class", "absolute inset-0 w-full h-full flex items-center justify-center");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$8, 26, 12, 2232);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$8, 23, 10, 1834);
    			attr_dev(div2, "class", "relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md");
    			add_location(div2, file$8, 22, 8, 1753);
    			attr_dev(div3, "class", "mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center");
    			add_location(div3, file$8, 12, 6, 920);
    			attr_dev(div4, "class", "lg:grid lg:grid-cols-12 lg:gap-8");
    			add_location(div4, file$8, 1, 4, 74);
    			attr_dev(main, "class", "mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32");
    			add_location(main, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h1);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			append_dev(h1, span3);
    			append_dev(span3, span1);
    			append_dev(span3, t3);
    			append_dev(span3, span2);
    			append_dev(div0, t5);
    			append_dev(div0, p);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, svg0);
    			append_dev(svg0, defs);
    			append_dev(defs, pattern);
    			append_dev(pattern, rect0);
    			append_dev(svg0, rect1);
    			append_dev(svg0, rect2);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(button, span4);
    			append_dev(button, t10);
    			append_dev(button, img);
    			append_dev(button, t11);
    			append_dev(button, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, circle);
    			append_dev(svg1, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/TopicCard.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/TopicCard.svelte";

    function create_fragment$9(ctx) {
    	let li;
    	let div0;
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let a;
    	let t2_value = /*topic*/ ctx[0].display_name + "";
    	let t2;
    	let a_href_value;
    	let t3;
    	let p;
    	let t4_value = /*topic*/ ctx[0].rowid + "";
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let button;
    	let span;
    	let t8;
    	let icon;
    	let current;
    	icon = new Icon({ props: { kind: "dots" }, $$inline: true });

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			t0 = text(/*abbr*/ ctx[1]);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			a = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = text(" items");
    			t6 = space();
    			div2 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Open options";
    			t8 = space();
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "flex-shrink-0 flex items-center justify-center w-16 bg-pink-600 text-white text-sm font-medium rounded-l-md");
    			add_location(div0, file$7, 8, 4, 203);
    			attr_dev(a, "href", a_href_value = "/topic/" + /*topic*/ ctx[0].id);
    			attr_dev(a, "class", "text-gray-900 font-medium hover:text-gray-600");
    			add_location(a, file$7, 11, 8, 532);
    			attr_dev(p, "class", "text-gray-500");
    			add_location(p, file$7, 12, 8, 650);
    			attr_dev(div1, "class", "flex-1 px-4 py-2 text-sm truncate");
    			add_location(div1, file$7, 10, 6, 476);
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$7, 16, 10, 993);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$7, 15, 8, 759);
    			attr_dev(div2, "class", "flex-shrink-0 pr-2");
    			add_location(div2, file$7, 14, 6, 718);
    			attr_dev(div3, "class", "flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate");
    			add_location(div3, file$7, 9, 4, 341);
    			attr_dev(li, "class", "col-span-1 flex shadow-sm rounded-md");
    			add_location(li, file$7, 7, 0, 149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, t0);
    			append_dev(li, t1);
    			append_dev(li, div3);
    			append_dev(div3, div1);
    			append_dev(div1, a);
    			append_dev(a, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(button, span);
    			append_dev(button, t8);
    			mount_component(icon, button, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*abbr*/ 2) set_data_dev(t0, /*abbr*/ ctx[1]);
    			if ((!current || dirty & /*topic*/ 1) && t2_value !== (t2_value = /*topic*/ ctx[0].display_name + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*topic*/ 1 && a_href_value !== (a_href_value = "/topic/" + /*topic*/ ctx[0].id)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*topic*/ 1) && t4_value !== (t4_value = /*topic*/ ctx[0].rowid + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let abbr;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicCard', slots, []);
    	let { topic } = $$props;
    	const writable_props = ['topic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	$$self.$capture_state = () => ({ topic, Icon, abbr });

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('abbr' in $$props) $$invalidate(1, abbr = $$props.abbr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*topic*/ 1) {
    			$$invalidate(1, abbr = topic.display_name.slice(0, 2).toUpperCase());
    		}
    	};

    	return [topic, abbr];
    }

    class TopicCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { topic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicCard",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console.warn("<TopicCard> was created without expected prop 'topic'");
    		}
    	}

    	get topic() {
    		throw new Error("<TopicCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<TopicCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TopicList.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1$1 } = globals;
    const file$6 = "src/TopicList.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (48:0) {:catch error}
    function create_catch_block$1(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[8].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$6, 48, 0, 1536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(48:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {:then topics}
    function create_then_block$1(ctx) {
    	let div;
    	let each_value = [...hierarchy(/*topics*/ ctx[1]).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "mt-6");
    			set_style(div, "columns", "6 240px");
    			set_style(div, "column-gap", "1rem");
    			add_location(div, file$6, 30, 0, 774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hierarchy, dataPromise*/ 1) {
    				each_value = [...hierarchy(/*topics*/ ctx[1]).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(29:0) {:then topics}",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#each hierarchy(topics).get(parent) as child}
    function create_each_block_1$1(ctx) {
    	let a;
    	let t_value = /*child*/ ctx[5].display_name + "";
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", "#/topic/" + /*child*/ ctx[5].id);
    			attr_dev(a, "class", "text-purple-600 no-underline hover:underline hover:text-purple-900 px-2");
    			add_location(a, file$6, 37, 12, 1239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(37:8) {#each hierarchy(topics).get(parent) as child}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#each [...hierarchy(topics).keys()] as parent}
    function create_each_block$4(ctx) {
    	let div1;
    	let h4;
    	let t0_value = /*parent*/ ctx[2].display_name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let p;
    	let span;
    	let t4;
    	let each_value_1 = hierarchy(/*topics*/ ctx[1]).get(/*parent*/ ctx[2]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			p = element("p");
    			span = element("span");
    			span.textContent = "and 37 more.";
    			t4 = space();
    			attr_dev(h4, "class", "mt-1 p-1 text-gray-900 font-semibold text-lg");
    			add_location(h4, file$6, 33, 8, 1017);
    			attr_dev(div0, "class", "mt-2 flex flex-wrap text-sm text-gray-900");
    			add_location(div0, file$6, 35, 8, 1116);
    			add_location(span, file$6, 41, 43, 1455);
    			attr_dev(p, "class", "mt-2 text-sm text-right");
    			add_location(p, file$6, 41, 8, 1420);
    			attr_dev(div1, "tabindex", "0");
    			attr_dev(div1, "class", "inline-block w-full mt-4 bg-white rounded-lg mt-4 px-4 py-4 shadow-lg focus:outline-none");
    			add_location(div1, file$6, 32, 4, 893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(h4, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, span);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hierarchy, dataPromise*/ 1) {
    				each_value_1 = hierarchy(/*topics*/ ctx[1]).get(/*parent*/ ctx[2]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(32:4) {#each [...hierarchy(topics).keys()] as parent}",
    		ctx
    	});

    	return block;
    }

    // (27:20)  <p>Fetching data...</p> {:then topics}
    function create_pending_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Fetching data...";
    			add_location(p, file$6, 27, 0, 734);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(27:20)  <p>Fetching data...</p> {:then topics}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let await_block_anchor;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 1,
    		error: 8
    	};

    	handle_promise(/*dataPromise*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getData$1() {
    	const res = await fetch(`/learn/topics.json?_shape=array`);

    	if (res.ok) {
    		return await res.json();
    	} else {
    		throw new Error();
    	}
    }

    function hierarchy(topics) {
    	return topics.reduce(
    		(map, topic) => {
    			if (!topic.first_parent_topic_id) {
    				map.set(topic, []);
    			} else {
    				let parent = topics.find(t => t.id == topic.first_parent_topic_id);
    				map.set(parent, [...map.get(parent), topic]);
    			}

    			return map;
    		},
    		new Map()
    	);
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicList', slots, []);
    	let dataPromise = getData$1();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TopicCard,
    		dataPromise,
    		getData: getData$1,
    		hierarchy
    	});

    	$$self.$inject_state = $$props => {
    		if ('dataPromise' in $$props) $$invalidate(0, dataPromise = $$props.dataPromise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataPromise];
    }

    class TopicList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicList",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/ItemCard.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/ItemCard.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			attr_dev(img, "class", "h-64 w-44 mr-6 mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$5, 5, 4, 76);
    			attr_dev(a, "href", a_href_value = "#/item/" + /*item*/ ctx[0].rowid);
    			add_location(a, file$5, 4, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && a_href_value !== (a_href_value = "#/item/" + /*item*/ ctx[0].rowid)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemCard', slots, []);
    	let { item } = $$props;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ item });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class ItemCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemCard",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ItemCard> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ItemCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ItemCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TopicDetail.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/TopicDetail.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (21:0) {#each items as item}
    function create_each_block$3(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemcard_changes = {};
    			if (dirty & /*items*/ 2) itemcard_changes.item = /*item*/ ctx[2];
    			itemcard.$set(itemcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(21:0) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*topic*/ ctx[0]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(h2, "class", "text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate");
    			add_location(h2, file$4, 15, 6, 374);
    			attr_dev(div0, "class", "flex-1 min-w-0");
    			add_location(div0, file$4, 14, 4, 339);
    			attr_dev(div1, "class", "md:flex md:items-center md:justify-between mb-8");
    			add_location(div1, file$4, 13, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*topic*/ 1) set_data_dev(t0, /*topic*/ ctx[0]);

    			if (dirty & /*items*/ 2) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicDetail', slots, []);
    	let { topic } = $$props;
    	let items = [];
    	const writable_props = ['topic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	$$self.$capture_state = () => ({ ItemCard, topic, items });

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*topic*/ 1) {
    			fetch(`/learn/items.json?_shape=array&topics__contains=${topic}`).then(r => r.json()).then(data => {
    				$$invalidate(1, items = data);
    			});
    		}
    	};

    	return [topic, items];
    }

    class TopicDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { topic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicDetail",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console.warn("<TopicDetail> was created without expected prop 'topic'");
    		}
    	}

    	get topic() {
    		throw new Error("<TopicDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<TopicDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FormatList.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1 } = globals;
    const file$3 = "src/FormatList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (32:0) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[5].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$3, 32, 0, 957);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(32:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {:then formats}
    function create_then_block(ctx) {
    	let div;
    	let each_value = /*formats*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "mt-6");
    			set_style(div, "columns", "6 240px");
    			set_style(div, "column-gap", "1rem");
    			add_location(div, file$3, 17, 0, 408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataPromise*/ 1) {
    				each_value = /*formats*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(16:0) {:then formats}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#each formats as format}
    function create_each_block$2(ctx) {
    	let div1;
    	let a;
    	let h4;
    	let t0_value = /*format*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let p;
    	let span;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a = element("a");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			p = element("p");
    			span = element("span");
    			span.textContent = "and 37 more.";
    			t4 = space();
    			attr_dev(h4, "class", "mt-1 p-1 text-gray-900 font-semibold text-lg");
    			add_location(h4, file$3, 20, 41, 662);
    			attr_dev(a, "href", "#/format/" + /*format*/ ctx[2].name);
    			add_location(a, file$3, 20, 8, 629);
    			attr_dev(div0, "class", "mt-2 flex flex-wrap text-sm text-gray-900");
    			add_location(div0, file$3, 22, 8, 757);
    			add_location(span, file$3, 25, 43, 876);
    			attr_dev(p, "class", "mt-2 text-sm text-right");
    			add_location(p, file$3, 25, 8, 841);
    			attr_dev(div1, "tabindex", "0");
    			attr_dev(div1, "class", "inline-block w-full mt-4 bg-white rounded-lg mt-4 px-4 py-4 shadow-lg focus:outline-none");
    			add_location(div1, file$3, 19, 4, 505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, h4);
    			append_dev(h4, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, span);
    			append_dev(div1, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(19:4) {#each formats as format}",
    		ctx
    	});

    	return block;
    }

    // (14:20)  <p>Fetching data...</p> {:then formats}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Fetching data...";
    			add_location(p, file$3, 14, 0, 367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(14:20)  <p>Fetching data...</p> {:then formats}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let await_block_anchor;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 1,
    		error: 5
    	};

    	handle_promise(/*dataPromise*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getData() {
    	const res = await fetch(`/learn.json?_shape=array&sql=select+distinct(substr(links%2C1%2Cinstr(links%2C'|')-1))+as+name+from+items`);

    	if (res.ok) {
    		return await res.json();
    	} else {
    		throw new Error();
    	}
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormatList', slots, []);
    	let dataPromise = getData();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormatList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ dataPromise, getData });

    	$$self.$inject_state = $$props => {
    		if ('dataPromise' in $$props) $$invalidate(0, dataPromise = $$props.dataPromise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataPromise];
    }

    class FormatList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormatList",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/FormatDetail.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/FormatDetail.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (19:0) {#each items as item}
    function create_each_block$1(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemcard_changes = {};
    			if (dirty & /*items*/ 2) itemcard_changes.item = /*item*/ ctx[2];
    			itemcard.$set(itemcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:0) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*format*/ ctx[0]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(h2, "class", "text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate");
    			add_location(h2, file$2, 14, 6, 375);
    			attr_dev(div0, "class", "flex-1 min-w-0");
    			add_location(div0, file$2, 13, 4, 340);
    			attr_dev(div1, "class", "md:flex md:items-center md:justify-between mb-8");
    			add_location(div1, file$2, 12, 0, 274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*format*/ 1) set_data_dev(t0, /*format*/ ctx[0]);

    			if (dirty & /*items*/ 2) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormatDetail', slots, []);
    	let { format } = $$props;
    	let items = [];
    	const writable_props = ['format'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormatDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('format' in $$props) $$invalidate(0, format = $$props.format);
    	};

    	$$self.$capture_state = () => ({ ItemCard, format, items });

    	$$self.$inject_state = $$props => {
    		if ('format' in $$props) $$invalidate(0, format = $$props.format);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*format*/ 1) {
    			fetch(`/learn/items.json?_shape=array&links__contains=${format}|`).then(r => r.json()).then(data => {
    				$$invalidate(1, items = data);
    			});
    		}
    	};

    	return [format, items];
    }

    class FormatDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { format: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormatDetail",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*format*/ ctx[0] === undefined && !('format' in props)) {
    			console.warn("<FormatDetail> was created without expected prop 'format'");
    		}
    	}

    	get format() {
    		throw new Error("<FormatDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<FormatDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CourseList.svelte generated by Svelte v3.48.0 */

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CourseList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CourseList> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CourseList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CourseList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/ItemDetail.svelte generated by Svelte v3.48.0 */

    const file$1 = "src/ItemDetail.svelte";

    // (21:0) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "loading...";
    			attr_dev(p, "class", "loading");
    			add_location(p, file$1, 21, 1, 492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(21:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:0) {#if item}
    function create_if_block$2(ctx) {
    	let h1;
    	let t0_value = /*item*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let a;
    	let img;
    	let img_src_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			img = element("img");
    			add_location(h1, file$1, 14, 0, 227);
    			attr_dev(img, "class", "h-64 w-44 mr-6 mb-6 float-left border border-purple-200 rounded-md shadow-md md:shadow-xl transform transition ease-out duration-300 hover:scale-105");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$1, 17, 4, 284);
    			attr_dev(a, "href", a_href_value = "#/item/" + /*item*/ ctx[0].rowid);
    			add_location(a, file$1, 16, 0, 249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && a_href_value !== (a_href_value = "#/item/" + /*item*/ ctx[0].rowid)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(14:0) {#if item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[0]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemDetail', slots, []);
    	let { itemid } = $$props;
    	let item;
    	const writable_props = ['itemid'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('itemid' in $$props) $$invalidate(1, itemid = $$props.itemid);
    	};

    	$$self.$capture_state = () => ({ itemid, item });

    	$$self.$inject_state = $$props => {
    		if ('itemid' in $$props) $$invalidate(1, itemid = $$props.itemid);
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*itemid*/ 2) {
    			fetch(`/learn/items/${itemid}.json?_shape=object`).then(r => r.json()).then(data => {
    				$$invalidate(0, item = data[itemid]);
    			});
    		}
    	};

    	return [item, itemid];
    }

    class ItemDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { itemid: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemDetail",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemid*/ ctx[1] === undefined && !('itemid' in props)) {
    			console.warn("<ItemDetail> was created without expected prop 'itemid'");
    		}
    	}

    	get itemid() {
    		throw new Error("<ItemDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemid(value) {
    		throw new Error("<ItemDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/AdvancedSearch.svelte generated by Svelte v3.48.0 */

    const file = "src/AdvancedSearch.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (67:8) {:else}
    function create_else_block(ctx) {
    	let div;
    	let svg;
    	let path;
    	let t0;
    	let p0;
    	let t2;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "No results found";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "We couldn’t find anything with that term. Please try again.";
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    			add_location(path, file, 72, 12, 4109);
    			attr_dev(svg, "class", "mx-auto h-6 w-6 text-gray-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file, 71, 10, 3928);
    			attr_dev(p0, "class", "mt-4 font-semibold text-gray-900");
    			add_location(p0, file, 74, 10, 4279);
    			attr_dev(p1, "class", "mt-2 text-gray-500");
    			add_location(p1, file, 75, 10, 4354);
    			attr_dev(div, "class", "border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14");
    			add_location(div, file, 69, 8, 3787);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			append_dev(div, t0);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, p1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(67:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:37) 
    function create_if_block_1$1(ctx) {
    	let ul2;
    	let li0;
    	let h20;
    	let t1;
    	let ul0;
    	let t2;
    	let li1;
    	let h21;
    	let t4;
    	let ul1;
    	let each_value_1 = /*results*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*results*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul2 = element("ul");
    			li0 = element("li");
    			h20 = element("h2");
    			h20.textContent = "Items";
    			t1 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			li1 = element("li");
    			h21 = element("h2");
    			h21.textContent = "Topics";
    			t4 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h20, "class", "bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900");
    			add_location(h20, file, 49, 12, 2751);
    			attr_dev(ul0, "class", "mt-2 text-sm text-gray-800");
    			add_location(ul0, file, 50, 12, 2846);
    			add_location(li0, file, 48, 10, 2734);
    			attr_dev(h21, "class", "bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900");
    			add_location(h21, file, 57, 12, 3221);
    			attr_dev(ul1, "class", "mt-2 text-sm text-gray-800");
    			add_location(ul1, file, 58, 12, 3317);
    			add_location(li1, file, 56, 10, 3204);
    			attr_dev(ul2, "class", "max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2");
    			attr_dev(ul2, "id", "options");
    			attr_dev(ul2, "role", "listbox");
    			add_location(ul2, file, 47, 8, 2618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul2, anchor);
    			append_dev(ul2, li0);
    			append_dev(li0, h20);
    			append_dev(li0, t1);
    			append_dev(li0, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(ul2, t2);
    			append_dev(ul2, li1);
    			append_dev(li1, h21);
    			append_dev(li1, t4);
    			append_dev(li1, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*results*/ 2) {
    				each_value_1 = /*results*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*results*/ 2) {
    				each_value = /*results*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(45:37) ",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#if !query }
    function create_if_block$1(ctx) {
    	let div;
    	let svg;
    	let path;
    	let t0;
    	let p0;
    	let t2;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Search for items, topics and creators";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Quickly look for resources by running a global search.";
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    			add_location(path, file, 38, 12, 2009);
    			attr_dev(svg, "class", "mx-auto h-6 w-6 text-gray-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file, 37, 10, 1828);
    			attr_dev(p0, "class", "mt-4 font-semibold text-gray-900");
    			add_location(p0, file, 40, 10, 2293);
    			attr_dev(p1, "class", "mt-2 text-gray-500");
    			add_location(p1, file, 41, 10, 2389);
    			attr_dev(div, "class", "border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14");
    			add_location(div, file, 35, 8, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			append_dev(div, t0);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, p1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(34:8) {#if !query }",
    		ctx
    	});

    	return block;
    }

    // (52:14) {#each results as item}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t_value = /*item*/ ctx[6].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = "#/item/" + /*item*/ ctx[6].rowid);
    			attr_dev(a, "class", "block cursor-default select-none px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer");
    			attr_dev(a, "id", "option-1");
    			attr_dev(a, "role", "option");
    			attr_dev(a, "tabindex", "-1");
    			add_location(a, file, 52, 18, 2942);
    			add_location(li, file, 52, 14, 2938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*results*/ 2 && t_value !== (t_value = /*item*/ ctx[6].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*results*/ 2 && a_href_value !== (a_href_value = "#/item/" + /*item*/ ctx[6].rowid)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(52:14) {#each results as item}",
    		ctx
    	});

    	return block;
    }

    // (60:16) {#each results as topic}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t_value = /*topic*/ ctx[3].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = "#/topic/" + /*topic*/ ctx[3].name);
    			attr_dev(a, "class", "block cursor-default select-none px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer");
    			attr_dev(a, "id", "option-1");
    			attr_dev(a, "role", "option");
    			attr_dev(a, "tabindex", "-1");
    			add_location(a, file, 60, 20, 3418);
    			add_location(li, file, 60, 16, 3414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*results*/ 2 && t_value !== (t_value = /*topic*/ ctx[3].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*results*/ 2 && a_href_value !== (a_href_value = "#/topic/" + /*topic*/ ctx[3].name)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(60:16) {#each results as topic}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let input;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*query*/ ctx[0]) return create_if_block$1;
    		if (/*results*/ ctx[1].length > 0) return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			if_block.c();
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file, 28, 12, 1138);
    			attr_dev(svg, "class", "pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file, 27, 10, 952);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm");
    			attr_dev(input, "placeholder", "Search...");
    			attr_dev(input, "role", "combobox");
    			attr_dev(input, "aria-expanded", "false");
    			attr_dev(input, "aria-controls", "options");
    			add_location(input, file, 30, 10, 1331);
    			attr_dev(div0, "class", "relative");
    			add_location(div0, file, 25, 8, 872);
    			attr_dev(div1, "class", "mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all");
    			add_location(div1, file, 24, 6, 728);
    			attr_dev(div2, "class", "overflow-y-auto p-4 sm:p-6 md:p-20");
    			add_location(div2, file, 13, 4, 258);
    			attr_dev(div3, "class", "relative");
    			add_location(div3, file, 11, 0, 230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div0, input);
    			set_input_value(input, /*query*/ ctx[0]);
    			append_dev(div1, t1);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*query*/ 1 && input.value !== /*query*/ ctx[0]) {
    				set_input_value(input, /*query*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdvancedSearch', slots, []);
    	let query = '';
    	let results = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AdvancedSearch> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		query = this.value;
    		$$invalidate(0, query);
    	}

    	$$self.$capture_state = () => ({ query, results });

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(0, query = $$props.query);
    		if ('results' in $$props) $$invalidate(1, results = $$props.results);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*query*/ 1) {
    			query && fetch(`/learn/items.json?_shape=array&name__contains=${query}`).then(r => r.json()).then(data => {
    				$$invalidate(1, results = data);
    			});
    		}
    	};

    	return [query, results, input_input_handler];
    }

    class AdvancedSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdvancedSearch",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const { window: window_1 } = globals;

    // (61:40) 
    function create_if_block_7(ctx) {
    	let advancedsearch;
    	let current;
    	advancedsearch = new AdvancedSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(advancedsearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(advancedsearch, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(advancedsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(advancedsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(advancedsearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(61:40) ",
    		ctx
    	});

    	return block;
    }

    // (59:47) 
    function create_if_block_6(ctx) {
    	let itemdetail;
    	let current;

    	itemdetail = new ItemDetail({
    			props: {
    				itemid: /*currentView*/ ctx[0].split("/")[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemdetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemdetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const itemdetail_changes = {};
    			if (dirty & /*currentView*/ 1) itemdetail_changes.itemid = /*currentView*/ ctx[0].split("/")[2];
    			itemdetail.$set(itemdetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemdetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemdetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemdetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(59:47) ",
    		ctx
    	});

    	return block;
    }

    // (57:41) 
    function create_if_block_5(ctx) {
    	let courselist;
    	let current;
    	courselist = new CourseList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(courselist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(courselist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(courselist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(courselist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(courselist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(57:41) ",
    		ctx
    	});

    	return block;
    }

    // (55:49) 
    function create_if_block_4(ctx) {
    	let formatdetail;
    	let current;

    	formatdetail = new FormatDetail({
    			props: {
    				format: /*currentView*/ ctx[0].split("/")[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formatdetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formatdetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formatdetail_changes = {};
    			if (dirty & /*currentView*/ 1) formatdetail_changes.format = /*currentView*/ ctx[0].split("/")[2];
    			formatdetail.$set(formatdetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formatdetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formatdetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formatdetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(55:49) ",
    		ctx
    	});

    	return block;
    }

    // (53:41) 
    function create_if_block_3(ctx) {
    	let formatlist;
    	let current;
    	formatlist = new FormatList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(formatlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formatlist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formatlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formatlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formatlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(53:41) ",
    		ctx
    	});

    	return block;
    }

    // (51:48) 
    function create_if_block_2(ctx) {
    	let topicdetail;
    	let current;

    	topicdetail = new TopicDetail({
    			props: {
    				topic: /*currentView*/ ctx[0].split("/")[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topicdetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicdetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topicdetail_changes = {};
    			if (dirty & /*currentView*/ 1) topicdetail_changes.topic = /*currentView*/ ctx[0].split("/")[2];
    			topicdetail.$set(topicdetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicdetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicdetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicdetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(51:48) ",
    		ctx
    	});

    	return block;
    }

    // (49:40) 
    function create_if_block_1(ctx) {
    	let topiclist;
    	let current;
    	topiclist = new TopicList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topiclist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topiclist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topiclist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topiclist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topiclist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(49:40) ",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if currentView === "/home" || currentView === "/"}
    function create_if_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(47:4) {#if currentView === \\\"/home\\\" || currentView === \\\"/\\\"}",
    		ctx
    	});

    	return block;
    }

    // (46:0) <TailwindUI.AppShell {sidebarItems}>
    function create_default_slot(ctx) {
    	let show_if;
    	let show_if_1;
    	let show_if_2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*currentView*/ 1) show_if = null;
    		if (dirty & /*currentView*/ 1) show_if_1 = null;
    		if (dirty & /*currentView*/ 1) show_if_2 = null;
    		if (/*currentView*/ ctx[0] === "/home" || /*currentView*/ ctx[0] === "/") return 0;
    		if (/*currentView*/ ctx[0] === "/topics") return 1;
    		if (show_if == null) show_if = !!/*currentView*/ ctx[0].startsWith("/topic/");
    		if (show_if) return 2;
    		if (/*currentView*/ ctx[0] === "/formats") return 3;
    		if (show_if_1 == null) show_if_1 = !!/*currentView*/ ctx[0].startsWith("/format/");
    		if (show_if_1) return 4;
    		if (/*currentView*/ ctx[0] === "/courses") return 5;
    		if (show_if_2 == null) show_if_2 = !!/*currentView*/ ctx[0].startsWith("/item/");
    		if (show_if_2) return 6;
    		if (/*currentView*/ ctx[0] === "/search") return 7;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx, -1))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(46:0) <TailwindUI.AppShell {sidebarItems}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwindui_appshell;
    	let current;
    	let mounted;
    	let dispose;

    	tailwindui_appshell = new AppShell({
    			props: {
    				sidebarItems: /*sidebarItems*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tailwindui_appshell.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindui_appshell, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "hashchange", /*hashchange*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tailwindui_appshell_changes = {};

    			if (dirty & /*$$scope, currentView*/ 17) {
    				tailwindui_appshell_changes.$$scope = { dirty, ctx };
    			}

    			tailwindui_appshell.$set(tailwindui_appshell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindui_appshell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindui_appshell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindui_appshell, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let sidebarItems = [
    		{
    			text: "Topics",
    			link: "#/topics",
    			icon: "home"
    		},
    		{
    			text: "Formats",
    			link: "#/formats",
    			icon: "home"
    		},
    		{
    			text: "Random item",
    			link: "#/item/1",
    			icon: "home"
    		},
    		{
    			text: "Search",
    			link: "#/search",
    			icon: "home"
    		},
    		{
    			text: "Datasette",
    			link: "/learn",
    			icon: "home"
    		}
    	];

    	let currentView = "/topics";

    	function handleTabChanged(event) {
    		$$invalidate(0, currentView = event.detail.tab);
    	}

    	async function hashchange() {
    		// the poor man's router!
    		const path = window.location.hash.slice(1);

    		if (path.length > 0) {
    			$$invalidate(0, currentView = path);
    		} else {
    			window.location.hash = '/home';
    			$$invalidate(0, currentView = '/home');
    		}
    	}

    	onMount(hashchange);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		TailwindUI,
    		Home,
    		TopicList,
    		TopicDetail,
    		FormatList,
    		FormatDetail,
    		CourseList,
    		ItemDetail,
    		AdvancedSearch,
    		sidebarItems,
    		currentView,
    		handleTabChanged,
    		hashchange
    	});

    	$$self.$inject_state = $$props => {
    		if ('sidebarItems' in $$props) $$invalidate(1, sidebarItems = $$props.sidebarItems);
    		if ('currentView' in $$props) $$invalidate(0, currentView = $$props.currentView);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentView, sidebarItems, hashchange];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    new App({
      target: document.querySelector('#app'),
    });

})();
//# sourceMappingURL=bundle.js.map
