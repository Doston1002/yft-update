import * as React from 'react';

function ratio({ width, height }) {
    return width / height;
}

function round(value, decimals = 0) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

function rankingFunctionComparator(rank) {
    return (a, b) => rank(b) - rank(a);
}
class MinHeap {
    constructor(comparator) {
        this.comparator = comparator;
        this.heap = [];
        this.n = 0;
    }
    greater(i, j) {
        return this.comparator(this.heap[i], this.heap[j]) < 0;
    }
    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }
    swim(i) {
        let k = i;
        let k2 = Math.floor(k / 2);
        while (k > 1 && this.greater(k2, k)) {
            this.swap(k2, k);
            k = k2;
            k2 = Math.floor(k / 2);
        }
    }
    sink(i) {
        let k = i;
        let k2 = k * 2;
        while (k2 <= this.n) {
            if (k2 < this.n && this.greater(k2, k2 + 1))
                k2 += 1;
            if (!this.greater(k, k2))
                break;
            this.swap(k, k2);
            k = k2;
            k2 = k * 2;
        }
    }
    push(element) {
        this.n += 1;
        this.heap[this.n] = element;
        this.swim(this.n);
    }
    pop() {
        if (this.n === 0)
            return undefined;
        this.swap(1, this.n);
        this.n -= 1;
        const max = this.heap.pop();
        this.sink(1);
        return max;
    }
    size() {
        return this.n;
    }
}

function buildPrecedentsMap(graph, startNode, endNode) {
    const precedentsMap = new Map();
    const visited = new Set();
    const storedShortestPaths = new Map();
    storedShortestPaths.set(startNode, 0);
    const queue = new MinHeap(rankingFunctionComparator((el) => el.weight));
    queue.push({ id: startNode, weight: 0 });
    while (queue.size() > 0) {
        const { id, weight } = queue.pop();
        if (!visited.has(id)) {
            const neighboringNodes = graph(id);
            visited.add(id);
            neighboringNodes.forEach((neighborWeight, neighbor) => {
                const newWeight = weight + neighborWeight;
                const currentId = precedentsMap.get(neighbor);
                const currentWeight = storedShortestPaths.get(neighbor);
                if (currentWeight === undefined ||
                    (currentWeight > newWeight &&
                        (currentWeight / newWeight > 1.005 || (currentId !== undefined && currentId < id)))) {
                    storedShortestPaths.set(neighbor, newWeight);
                    queue.push({ id: neighbor, weight: newWeight });
                    precedentsMap.set(neighbor, id);
                }
            });
        }
    }
    return storedShortestPaths.has(endNode) ? precedentsMap : undefined;
}
function getPathFromPrecedentsMap(precedentsMap, endNode) {
    const nodes = [];
    for (let node = endNode; node !== undefined; node = precedentsMap.get(node)) {
        nodes.push(node);
    }
    return nodes.reverse();
}
function findShortestPath(graph, startNode, endNode) {
    const precedentsMap = buildPrecedentsMap(graph, startNode, endNode);
    return precedentsMap ? getPathFromPrecedentsMap(precedentsMap, endNode) : undefined;
}

function findIdealNodeSearch({ photos, targetRowHeight, containerWidth, }) {
    const minRatio = photos.reduce((acc, photo) => Math.min(ratio(photo), acc), Number.MAX_VALUE);
    return round(containerWidth / targetRowHeight / minRatio) + 2;
}
function getCommonHeight(row, containerWidth, spacing, padding) {
    const rowWidth = containerWidth - (row.length - 1) * spacing - 2 * padding * row.length;
    const totalAspectRatio = row.reduce((acc, photo) => acc + ratio(photo), 0);
    return rowWidth / totalAspectRatio;
}
function cost(photos, i, j, width, targetRowHeight, spacing, padding) {
    const row = photos.slice(i, j);
    const commonHeight = getCommonHeight(row, width, spacing, padding);
    return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 * row.length : undefined;
}
function makeGetRowNeighbors({ photos, layoutOptions, targetRowHeight, limitNodeSearch, rowConstraints, }) {
    return (node) => {
        var _a, _b;
        const { containerWidth, spacing, padding } = layoutOptions;
        const results = new Map();
        results.set(node, 0);
        const startOffset = (_a = rowConstraints === null || rowConstraints === void 0 ? void 0 : rowConstraints.minPhotos) !== null && _a !== void 0 ? _a : 1;
        const endOffset = Math.min(limitNodeSearch, (_b = rowConstraints === null || rowConstraints === void 0 ? void 0 : rowConstraints.maxPhotos) !== null && _b !== void 0 ? _b : Infinity);
        for (let i = node + startOffset; i < photos.length + 1; i += 1) {
            if (i - node > endOffset)
                break;
            const currentCost = cost(photos, node, i, containerWidth, targetRowHeight, spacing, padding);
            if (currentCost === undefined)
                break;
            results.set(i, currentCost);
        }
        return results;
    };
}
function computeRowsLayout({ photos, layoutOptions, }) {
    const { spacing, padding, containerWidth, targetRowHeight, rowConstraints } = layoutOptions;
    const limitNodeSearch = findIdealNodeSearch({ photos, containerWidth, targetRowHeight });
    const getNeighbors = makeGetRowNeighbors({
        photos,
        layoutOptions,
        targetRowHeight,
        limitNodeSearch,
        rowConstraints,
    });
    const path = findShortestPath(getNeighbors, 0, photos.length);
    if (path === undefined)
        return undefined;
    const layout = [];
    for (let i = 1; i < path.length; i += 1) {
        const row = photos.map((photo, index) => ({ photo, index })).slice(path[i - 1], path[i]);
        const height = getCommonHeight(row.map(({ photo }) => photo), containerWidth, spacing, padding);
        layout.push(row.map(({ photo, index }, photoIndex) => ({
            photo,
            layout: {
                height,
                width: height * ratio(photo),
                index,
                photoIndex,
                photosCount: row.length,
            },
        })));
    }
    return layout;
}

function calcWidth(base, { width, photosCount }, { spacing, padding, containerWidth }) {
    const gaps = spacing * (photosCount - 1) + 2 * padding * photosCount;
    return `calc((${base} - ${gaps}px) / ${round((containerWidth - gaps) / width, 5)})`;
}
function cssPhotoWidth(layout, layoutOptions) {
    return layoutOptions.layout !== "rows"
        ? `calc(100% - ${2 * layoutOptions.padding}px)`
        : calcWidth("100%", layout, layoutOptions);
}
function calculateSizesValue(size, layout, layoutOptions) {
    var _a, _b;
    return calcWidth((_b = (_a = size.match(/calc\((.*)\)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : size, layout, layoutOptions);
}
function srcSetAndSizes(photo, layout, layoutOptions) {
    let srcSet;
    let sizes;
    if (photo.images && photo.images.length > 0) {
        srcSet = photo.images
            .concat(!photo.images.find(({ width }) => width === photo.width)
            ? [{ src: photo.src, width: photo.width, height: photo.height }]
            : [])
            .sort((first, second) => first.width - second.width)
            .map((image) => `${image.src} ${image.width}w`)
            .join(", ");
        if (layoutOptions.sizes) {
            sizes = (layoutOptions.sizes.sizes || [])
                .map(({ viewport, size }) => `${viewport} ${calculateSizesValue(size, layout, layoutOptions)}`)
                .concat(calculateSizesValue(layoutOptions.sizes.size, layout, layoutOptions))
                .join(", ");
        }
        else {
            sizes = `${Math.ceil((layout.width / layoutOptions.containerWidth) * 100)}vw`;
        }
    }
    return { srcSet, sizes };
}
function PhotoRenderer(props) {
    var _a, _b;
    const { photo, layout, layoutOptions, imageProps: { style, ...restImageProps } = {}, renderPhoto } = props;
    const { onClick } = layoutOptions;
    const imageStyle = {
        display: "block",
        boxSizing: "content-box",
        width: cssPhotoWidth(layout, layoutOptions),
        height: "auto",
        aspectRatio: `${photo.width} / ${photo.height}`,
        ...(layoutOptions.padding ? { padding: `${layoutOptions.padding}px` } : null),
        ...((layoutOptions.layout === "columns" || layoutOptions.layout === "masonry") &&
            layout.photoIndex < layout.photosCount - 1
            ? { marginBottom: `${layoutOptions.spacing}px` }
            : null),
        ...(onClick ? { cursor: "pointer" } : null),
        ...style,
    };
    const handleClick = onClick
        ? (event) => {
            onClick({ event, photo, index: layout.index });
        }
        : undefined;
    const imageProps = {
        src: photo.src,
        alt: (_a = photo.alt) !== null && _a !== void 0 ? _a : "",
        title: photo.title,
        onClick: handleClick,
        style: imageStyle,
        className: "react-photo-album--photo",
        loading: "lazy",
        decoding: "async",
        ...srcSetAndSizes(photo, layout, layoutOptions),
        ...restImageProps,
    };
    const renderDefaultPhoto = (options) => {
        const { src, alt, srcSet, sizes, style: unwrappedStyle, ...rest } = imageProps;
        return (React.createElement("img", { alt: alt, ...(srcSet ? { srcSet, sizes } : null), src: src, style: (options === null || options === void 0 ? void 0 : options.wrapped) ? { display: "block", width: "100%", height: "100%" } : unwrappedStyle, ...rest }));
    };
    const wrapperStyle = (({ display, boxSizing, width, aspectRatio, padding, marginBottom, cursor }) => ({
        display,
        boxSizing,
        width,
        aspectRatio,
        padding,
        marginBottom,
        cursor,
    }))(imageStyle);
    return (React.createElement(React.Fragment, null, (_b = renderPhoto === null || renderPhoto === void 0 ? void 0 : renderPhoto({
        photo,
        layout,
        layoutOptions,
        imageProps,
        renderDefaultPhoto,
        wrapperStyle,
    })) !== null && _b !== void 0 ? _b : renderDefaultPhoto()));
}

function defaultRenderRowContainer({ rowContainerProps, children, }) {
    return React.createElement("div", { ...rowContainerProps }, children);
}
function RowContainerRenderer(props) {
    const { layoutOptions, rowIndex, rowsCount, renderRowContainer, rowContainerProps: { style, ...restRowContainerProps } = {}, children, } = props;
    const rowContainerProps = {
        className: "react-photo-album--row",
        style: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            ...(rowIndex < rowsCount - 1 ? { marginBottom: `${layoutOptions.spacing}px` } : null),
            ...style,
        },
        ...restRowContainerProps,
    };
    return (React.createElement(React.Fragment, null, (renderRowContainer !== null && renderRowContainer !== void 0 ? renderRowContainer : defaultRenderRowContainer)({
        layoutOptions,
        rowIndex,
        rowsCount,
        rowContainerProps,
        children,
    })));
}

function RowsLayout(props) {
    const { photos, layoutOptions, renderPhoto, renderRowContainer, componentsProps } = props;
    const rowsLayout = computeRowsLayout({ photos, layoutOptions });
    if (!rowsLayout)
        return null;
    return (React.createElement(React.Fragment, null, rowsLayout.map((row, rowIndex) => (React.createElement(RowContainerRenderer, { key: `row-${rowIndex}`, layoutOptions: layoutOptions, rowIndex: rowIndex, rowsCount: rowsLayout.length, renderRowContainer: renderRowContainer, rowContainerProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.rowContainerProps }, row.map(({ photo, layout }) => (React.createElement(PhotoRenderer, { key: photo.key || photo.src, photo: photo, layout: layout, layoutOptions: layoutOptions, renderPhoto: renderPhoto, imageProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.imageProps }))))))));
}

function computeShortestPath(graph, pathLength, startNode, endNode) {
    const matrix = new Map();
    const queue = new Set();
    queue.add(startNode);
    for (let length = 0; length < pathLength; length += 1) {
        const currentQueue = [...queue.keys()];
        queue.clear();
        currentQueue.forEach((node) => {
            const accumulatedWeight = length > 0 ? matrix.get(node)[length].weight : 0;
            graph(node).forEach(({ neighbor, weight }) => {
                let paths = matrix.get(neighbor);
                if (!paths) {
                    paths = [];
                    matrix.set(neighbor, paths);
                }
                const newWeight = accumulatedWeight + weight;
                const nextPath = paths[length + 1];
                if (!nextPath ||
                    (nextPath.weight > newWeight && (nextPath.weight / newWeight > 1.0001 || node < nextPath.node))) {
                    paths[length + 1] = { node, weight: newWeight };
                }
                if (length < pathLength - 1 && neighbor !== endNode) {
                    queue.add(neighbor);
                }
            });
        });
    }
    return matrix;
}
function reconstructShortestPath(matrix, pathLength, endNode) {
    const path = [endNode];
    for (let node = endNode, length = pathLength; length > 0; length -= 1) {
        node = matrix.get(node)[length].node;
        path.push(node);
    }
    return path.reverse();
}
function findShortestPathLengthN(graph, pathLength, startNode, endNode) {
    return reconstructShortestPath(computeShortestPath(graph, pathLength, startNode, endNode), pathLength, endNode);
}

function makeGetColumnNeighbors({ photos, spacing, padding, targetColumnWidth, targetColumnHeight, }) {
    return (node) => {
        const results = [];
        const cutOffHeight = targetColumnHeight * 1.5;
        let height = targetColumnWidth / ratio(photos[node]) + 2 * padding;
        for (let i = node + 1; i < photos.length + 1; i += 1) {
            results.push({ neighbor: i, weight: (targetColumnHeight - height) ** 2 });
            if (height > cutOffHeight || i === photos.length) {
                break;
            }
            height += targetColumnWidth / ratio(photos[i]) + spacing + 2 * padding;
        }
        return results;
    };
}
function buildColumnsModel({ path, photos, containerWidth, columnsGaps, columnsRatios, spacing, padding, }) {
    const columnsModel = [];
    const totalRatio = columnsRatios.reduce((total, columnRatio) => total + columnRatio, 0);
    for (let i = 0; i < path.length - 1; i += 1) {
        const column = photos.map((photo, index) => ({ photo, index })).slice(path[i], path[i + 1]);
        const totalAdjustedGaps = columnsRatios.reduce((total, columnRatio, index) => total + (columnsGaps[i] - columnsGaps[index]) * columnRatio, 0);
        const columnWidth = ((containerWidth - (path.length - 2) * spacing - 2 * (path.length - 1) * padding - totalAdjustedGaps) *
            columnsRatios[i]) /
            totalRatio;
        columnsModel.push(column.map(({ photo, index }, photoIndex) => ({
            photo,
            layout: {
                width: columnWidth,
                height: columnWidth / ratio(photo),
                index,
                photoIndex,
                photosCount: column.length,
            },
        })));
    }
    return columnsModel;
}
function computeColumnsModel({ photos, layoutOptions, targetColumnWidth, }) {
    const { columns, spacing, padding, containerWidth } = layoutOptions;
    const columnsGaps = [];
    const columnsRatios = [];
    if (photos.length <= columns) {
        const averageRatio = photos.length > 0 ? photos.reduce((acc, photo) => acc + ratio(photo), 0) / photos.length : 1;
        for (let i = 0; i < columns; i += 1) {
            columnsGaps[i] = 2 * padding;
            columnsRatios[i] = i < photos.length ? ratio(photos[i]) : averageRatio;
        }
        const columnsModel = buildColumnsModel({
            path: Array.from({ length: columns + 1 }).map((_, index) => Math.min(index, photos.length)),
            photos,
            columnsRatios,
            columnsGaps,
            containerWidth,
            spacing,
            padding,
        });
        return { columnsGaps, columnsRatios, columnsModel };
    }
    const targetColumnHeight = (photos.reduce((acc, photo) => acc + targetColumnWidth / ratio(photo), 0) +
        spacing * (photos.length - columns) +
        2 * padding * photos.length) /
        columns;
    const getNeighbors = makeGetColumnNeighbors({
        photos,
        targetColumnWidth,
        targetColumnHeight,
        spacing,
        padding,
    });
    const path = findShortestPathLengthN(getNeighbors, columns, 0, photos.length);
    for (let i = 0; i < path.length - 1; i += 1) {
        const column = photos.slice(path[i], path[i + 1]);
        columnsGaps[i] = spacing * (column.length - 1) + 2 * padding * column.length;
        columnsRatios[i] = 1 / column.reduce((acc, photo) => acc + 1 / ratio(photo), 0);
    }
    const columnsModel = buildColumnsModel({
        path,
        photos,
        columnsRatios,
        columnsGaps,
        containerWidth,
        spacing,
        padding,
    });
    return { columnsGaps, columnsRatios, columnsModel };
}
function computeLayout(props) {
    const { photos, layoutOptions } = props;
    const { columns, spacing, padding, containerWidth } = layoutOptions;
    const targetColumnWidth = (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns;
    const { columnsGaps, columnsRatios, columnsModel } = computeColumnsModel({
        photos,
        layoutOptions,
        targetColumnWidth,
    });
    if (columnsModel.findIndex((columnModel) => columnModel.findIndex(({ layout: { width, height } }) => width < 0 || height < 0) >= 0) >= 0) {
        if (columns > 1) {
            return computeLayout({ photos, layoutOptions: { ...layoutOptions, columns: columns - 1 } });
        }
        return undefined;
    }
    return { columnsModel, columnsGaps, columnsRatios };
}
function computeColumnsLayout({ photos, layoutOptions, }) {
    return computeLayout({ photos, layoutOptions });
}

function defaultRenderColumnContainer({ columnContainerProps, children, }) {
    return React.createElement("div", { ...columnContainerProps }, children);
}
function cssColumnWidth(props) {
    const { layoutOptions, columnIndex, columnsCount, columnsGaps, columnsRatios } = props;
    const { layout, spacing, padding } = layoutOptions;
    if (layout === "masonry" || !columnsGaps || !columnsRatios) {
        return `calc((100% - ${spacing * (columnsCount - 1)}px) / ${columnsCount})`;
    }
    const totalRatio = columnsRatios.reduce((acc, ratio) => acc + ratio, 0);
    const totalAdjustedGaps = columnsRatios.reduce((acc, ratio, index) => acc + (columnsGaps[columnIndex] - columnsGaps[index]) * ratio, 0);
    return `calc((100% - ${round((columnsCount - 1) * spacing + 2 * columnsCount * padding + totalAdjustedGaps, 3)}px) * ${round(columnsRatios[columnIndex] / totalRatio, 5)} + ${2 * padding}px)`;
}
function ColumnContainerRenderer(props) {
    const { layoutOptions, renderColumnContainer, children, columnContainerProps: { style, ...restColumnContainerProps } = {}, ...rest } = props;
    const columnContainerProps = {
        className: "react-photo-album--column",
        style: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            width: cssColumnWidth(props),
            justifyContent: layoutOptions.layout === "columns" ? "space-between" : "flex-start",
            ...style,
        },
        ...restColumnContainerProps,
    };
    return (React.createElement(React.Fragment, null, (renderColumnContainer !== null && renderColumnContainer !== void 0 ? renderColumnContainer : defaultRenderColumnContainer)({
        layoutOptions,
        columnContainerProps,
        children,
        ...rest,
    })));
}

function ColumnsLayout(props) {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, componentsProps } = props;
    const columnsLayout = computeColumnsLayout({ photos, layoutOptions });
    if (!columnsLayout)
        return null;
    const { columnsModel, columnsRatios, columnsGaps } = columnsLayout;
    return (React.createElement(React.Fragment, null, columnsModel.map((column, columnIndex) => (React.createElement(ColumnContainerRenderer, { key: `column-${columnIndex}`, layoutOptions: layoutOptions, columnIndex: columnIndex, columnsCount: columnsModel.length, columnsGaps: columnsGaps, columnsRatios: columnsRatios, renderColumnContainer: renderColumnContainer, columnContainerProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.columnContainerProps }, column.map(({ photo, layout }) => (React.createElement(PhotoRenderer, { key: photo.key || photo.src, photo: photo, layout: layout, layoutOptions: layoutOptions, renderPhoto: renderPhoto, imageProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.imageProps }))))))));
}

function computeMasonryLayout(props) {
    const { photos, layoutOptions } = props;
    const { columns, spacing, padding, containerWidth } = layoutOptions;
    const columnWidth = (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns;
    if (columnWidth <= 0) {
        return columns > 1
            ? computeMasonryLayout({
                ...props,
                layoutOptions: { ...layoutOptions, columns: columns - 1 },
            })
            : undefined;
    }
    const columnsCurrentTopPositions = [];
    for (let i = 0; i < columns; i += 1) {
        columnsCurrentTopPositions[i] = 0;
    }
    const columnsModel = photos.reduce((model, photo, index) => {
        const shortestColumn = columnsCurrentTopPositions.reduce((currentShortestColumn, item, i) => item < columnsCurrentTopPositions[currentShortestColumn] - 1 ? i : currentShortestColumn, 0);
        columnsCurrentTopPositions[shortestColumn] =
            columnsCurrentTopPositions[shortestColumn] + columnWidth / ratio(photo) + spacing + 2 * padding;
        model[shortestColumn].push({ photo, index });
        return model;
    }, Array.from({ length: columns }).map(() => []));
    return columnsModel.map((column) => column.map(({ photo, index }, photoIndex) => ({
        photo,
        layout: {
            width: columnWidth,
            height: columnWidth / ratio(photo),
            index,
            photoIndex,
            photosCount: column.length,
        },
    })));
}

function MasonryLayout(props) {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, componentsProps } = props;
    const masonryLayout = computeMasonryLayout({ photos, layoutOptions });
    if (!masonryLayout)
        return null;
    return (React.createElement(React.Fragment, null, masonryLayout.map((column, columnIndex) => (React.createElement(ColumnContainerRenderer, { key: `masonry-column-${columnIndex}`, layoutOptions: layoutOptions, columnsCount: masonryLayout.length, columnIndex: columnIndex, renderColumnContainer: renderColumnContainer, columnContainerProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.columnContainerProps }, column.map(({ photo, layout }) => (React.createElement(PhotoRenderer, { key: photo.key || photo.src, photo: photo, layout: layout, layoutOptions: layoutOptions, renderPhoto: renderPhoto, imageProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.imageProps }))))))));
}

function defaultRenderContainer({ containerProps, children, containerRef }) {
    return (React.createElement("div", { ref: containerRef, ...containerProps }, children));
}
function ContainerRenderer(props) {
    const { layout, renderContainer, children, containerRef, containerProps: { style, ...restContainerProps } = {}, } = props;
    const containerProps = {
        className: `react-photo-album react-photo-album--${layout}`,
        style: {
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            flexDirection: layout === "rows" ? "column" : "row",
            ...style,
        },
        ...restContainerProps,
    };
    return (React.createElement(React.Fragment, null, (renderContainer !== null && renderContainer !== void 0 ? renderContainer : defaultRenderContainer)({
        containerProps,
        containerRef,
        layout,
        children,
    })));
}

function useArray(array) {
    const ref = React.useRef(array);
    if (!array || !ref.current || array.join() !== ref.current.join()) {
        ref.current = array;
    }
    return ref.current;
}

function containerWidthReducer(state, { newContainerWidth, newScrollbarWidth }) {
    const { containerWidth, scrollbarWidth } = state;
    if (containerWidth !== undefined &&
        scrollbarWidth !== undefined &&
        newContainerWidth !== undefined &&
        newScrollbarWidth !== undefined &&
        newContainerWidth > containerWidth &&
        newContainerWidth - containerWidth <= 20 &&
        newScrollbarWidth < scrollbarWidth) {
        return { containerWidth, scrollbarWidth: newScrollbarWidth };
    }
    return containerWidth !== newContainerWidth || scrollbarWidth !== newScrollbarWidth
        ? { containerWidth: newContainerWidth, scrollbarWidth: newScrollbarWidth }
        : state;
}
function resolveContainerWidth(el, breakpoints) {
    let width = el === null || el === void 0 ? void 0 : el.clientWidth;
    if (width !== undefined && breakpoints && breakpoints.length > 0) {
        const sorted = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
        sorted.push(Math.floor(sorted[sorted.length - 1] / 2));
        const threshold = width;
        width = sorted.find((breakpoint, index) => breakpoint <= threshold || index === sorted.length - 1);
    }
    return width;
}
function useContainerWidth(breakpoints, defaultContainerWidth) {
    const [{ containerWidth }, dispatch] = React.useReducer(containerWidthReducer, {
        containerWidth: defaultContainerWidth,
    });
    const ref = React.useRef(null);
    const observerRef = React.useRef();
    const containerRef = React.useCallback((node) => {
        var _a;
        (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        observerRef.current = undefined;
        ref.current = node;
        const updateWidth = () => dispatch({
            newContainerWidth: resolveContainerWidth(ref.current, breakpoints),
            newScrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
        });
        updateWidth();
        if (node && typeof ResizeObserver !== "undefined") {
            observerRef.current = new ResizeObserver(updateWidth);
            observerRef.current.observe(node);
        }
    }, [breakpoints]);
    return { containerRef, containerWidth };
}

const breakpoints = Object.freeze([1200, 600, 300, 0]);
function unwrap(value, containerWidth) {
    return typeof value === "function" ? value(containerWidth) : value;
}
function unwrapParameter(value, containerWidth) {
    return typeof value !== "undefined" ? unwrap(value, containerWidth) : undefined;
}
function selectResponsiveValue(values, containerWidth) {
    const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
    return unwrap(values[index >= 0 ? index : 0], containerWidth);
}
function resolveResponsiveParameter(parameter, containerWidth, values, minValue = 0) {
    const value = unwrapParameter(parameter, containerWidth);
    return Math.round(Math.max(value === undefined ? selectResponsiveValue(values, containerWidth) : value, minValue));
}

function resolveLayoutOptions({ layout, onClick, containerWidth, targetRowHeight, rowConstraints, columns, spacing, padding, sizes, }) {
    return {
        layout,
        onClick,
        containerWidth,
        columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
        spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 15, 10, 5]),
        padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0, 0]),
        targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
            (w) => w / 5,
            (w) => w / 4,
            (w) => w / 3,
            (w) => w / 2,
        ]),
        rowConstraints: unwrapParameter(rowConstraints, containerWidth),
        sizes,
    };
}
function resolveComponentsProps(componentsProps, containerWidth) {
    return typeof componentsProps === "function" ? componentsProps(containerWidth) : componentsProps;
}
function renderLayout(props, containerWidth, componentsProps) {
    const { photos, layout, renderPhoto, renderRowContainer, renderColumnContainer } = props;
    const layoutOptions = resolveLayoutOptions({ containerWidth, ...props });
    const commonLayoutProps = { photos, renderPhoto, componentsProps };
    if (layout === "rows") {
        return (React.createElement(RowsLayout, { layoutOptions: layoutOptions, renderRowContainer: renderRowContainer, ...commonLayoutProps }));
    }
    if (layout === "columns") {
        return (React.createElement(ColumnsLayout, { layoutOptions: layoutOptions, renderColumnContainer: renderColumnContainer, ...commonLayoutProps }));
    }
    return (React.createElement(MasonryLayout, { layoutOptions: layoutOptions, renderColumnContainer: renderColumnContainer, ...commonLayoutProps }));
}
function PhotoAlbum(props) {
    const { photos, layout, renderContainer, defaultContainerWidth, breakpoints } = props;
    const { containerRef, containerWidth } = useContainerWidth(useArray(breakpoints), defaultContainerWidth);
    if (!layout || !["rows", "columns", "masonry"].includes(layout) || !Array.isArray(photos))
        return null;
    const componentsProps = resolveComponentsProps(props.componentsProps, containerWidth);
    return (React.createElement(ContainerRenderer, { layout: layout, containerRef: containerRef, renderContainer: renderContainer, containerProps: componentsProps === null || componentsProps === void 0 ? void 0 : componentsProps.containerProps }, containerWidth ? renderLayout(props, containerWidth, componentsProps) : null));
}

export { PhotoAlbum, PhotoAlbum as default };
