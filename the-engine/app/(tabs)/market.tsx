import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, Modal } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOCK_PRODUCTS, MOCK_STREAMS, MOCK_FORUM_POSTS, Product, LiveStream, ForumPost } from '../../data/mockMarketplace';
import { useAppStore } from '../../store/useAppStore';

type MarketTab = 'shop' | 'live' | 'forum' | 'style';

export default function MarketScreen() {
    const [activeTab, setActiveTab] = useState<MarketTab>('shop');
    const { mode } = useAppStore();
    const activeColor = mode === 'race' ? Colors.race : Colors.fun;
    const [selectedItem, setSelectedItem] = useState<{ type: MarketTab, data: any } | null>(null);

    const renderDetailModal = () => {
        if (!selectedItem) return null;
        const { type, data } = selectedItem;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedItem}
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {type === 'shop' && 'Product Details'}
                                {type === 'live' && 'Live Stream'}
                                {type === 'forum' && 'Discussion'}
                                {type === 'style' && 'Sourced Item'}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {data.image && (
                                <Image source={data.image} style={styles.modalImage} resizeMode="cover" />
                            )}

                            <Text style={styles.detailsTitle}>{data.title || data.name}</Text>

                            {type === 'shop' && (
                                <>
                                    <Text style={styles.detailsPrice}>${data.price}</Text>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Condition:</Text>
                                        <Text style={styles.detailsValue}>{data.condition}</Text>
                                    </View>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Seller:</Text>
                                        <Text style={styles.detailsValue}>{data.seller.name}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.primaryButton}>
                                        <Text style={styles.primaryButtonText}>Message Seller</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {type === 'live' && (
                                <>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Host:</Text>
                                        <Text style={styles.detailsValue}>@{data.host}</Text>
                                    </View>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Viewers:</Text>
                                        <Text style={styles.detailsValue}>{data.viewers}</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#FF0055' }]}>
                                        <Text style={styles.primaryButtonText}>Join Stream</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {type === 'forum' && (
                                <>
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Posted by:</Text>
                                        <Text style={styles.detailsValue}>{data.author}</Text>
                                    </View>
                                    <Text style={styles.detailsBody}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </Text>
                                    <TouchableOpacity style={styles.primaryButton}>
                                        <Text style={styles.primaryButtonText}>Reply to Thread</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>MARKET</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Search', 'Search bar opening...')}>
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Cart', 'Your cart is empty')}>
                        <Ionicons name="cart-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                {[
                    { key: 'shop', label: 'Gear Shop', icon: 'pricetag' },
                    { key: 'live', label: 'Live Drops', icon: 'radio' },
                    { key: 'forum', label: 'Forum', icon: 'chatbubbles' },
                    { key: 'style', label: 'Style Match', icon: 'camera' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key as MarketTab)}
                        style={[
                            styles.tabItem,
                            activeTab === tab.key && { backgroundColor: activeColor + '20', borderColor: activeColor }
                        ]}
                    >
                        <Ionicons
                            name={tab.icon as any}
                            size={18}
                            color={activeTab === tab.key ? activeColor : Colors.textDim}
                        />
                        <Text style={[
                            styles.tabLabel,
                            { color: activeTab === tab.key ? activeColor : Colors.textDim }
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderShop = () => (
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {['All', 'New Gear', 'Used Gear', 'Apparel', 'Tech'].map((cat, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.categoryChip}
                        onPress={() => Alert.alert('Filter', `Filtering by ${cat}`)}
                    >
                        <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Products Grid */}
            <View style={styles.productGrid}>
                {MOCK_PRODUCTS.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => setSelectedItem({ type: 'shop', data: product })}
                    >
                        <View style={styles.productImageContainer}>
                            <Image source={product.image} style={styles.productImage} resizeMode="cover" />
                            <View style={styles.conditionBadge}>
                                <Text style={styles.conditionText}>{product.condition}</Text>
                            </View>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                            <Text style={styles.productPrice}>${product.price}</Text>
                            {product.originalPrice && (
                                <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                            )}
                            <View style={styles.sellerRow}>
                                <Ionicons name="person-circle-outline" size={14} color={Colors.textDim} />
                                <Text style={styles.sellerName}>{product.seller.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderLive = () => (
        <FlatList
            data={MOCK_STREAMS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.liveCard}
                    onPress={() => setSelectedItem({ type: 'live', data: item })}
                >
                    <Image source={item.image} style={styles.liveThumbnail} />
                    <View style={styles.liveOverlay} />

                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>

                    <View style={styles.viewerBadge}>
                        <Ionicons name="eye" size={12} color="white" />
                        <Text style={styles.viewerText}>{item.viewers}</Text>
                    </View>

                    <View style={styles.liveInfo}>
                        <Text style={styles.liveTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.liveHost}>@{item.host}</Text>
                    </View>
                </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={styles.liveGrid}
            contentContainerStyle={styles.contentContainer}
        />
    );

    const renderForum = () => (
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {MOCK_FORUM_POSTS.map((post) => (
                <TouchableOpacity
                    key={post.id}
                    style={styles.forumCard}
                    onPress={() => setSelectedItem({ type: 'forum', data: post })}
                >
                    {/* Upvote Column */}
                    <View style={styles.voteColumn}>
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); Alert.alert('Vote', 'Upvoted!'); }}>
                            <Ionicons name="arrow-up" size={24} color={Colors.textDim} />
                        </TouchableOpacity>
                        <Text style={styles.voteCount}>{post.upvotes}</Text>
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); Alert.alert('Vote', 'Downvoted!'); }}>
                            <Ionicons name="arrow-down" size={24} color={Colors.textDim} />
                        </TouchableOpacity>
                    </View>

                    {/* Content Column */}
                    <View style={styles.postContent}>
                        <View style={styles.postHeader}>
                            <Text style={styles.postCategory}>{post.category}</Text>
                            <Text style={styles.postDot}>•</Text>
                            <Text style={styles.postAuthor}>{post.author}</Text>
                            <Text style={styles.postDot}>•</Text>
                            <Text style={styles.postTime}>{post.time}</Text>
                        </View>

                        <Text style={styles.postTitle}>{post.title}</Text>

                        <View style={styles.postActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Ionicons name="chatbox-outline" size={18} color={Colors.textDim} />
                                <Text style={styles.actionText}>{post.comments} Comments</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Ionicons name="share-social-outline" size={18} color={Colors.textDim} />
                                <Text style={styles.actionText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderStyleMatch = () => (
        <View style={styles.styleContainer}>
            <View style={styles.cameraPlaceholder}>
                <View style={[styles.scanLine, { backgroundColor: activeColor }]} />
                <Ionicons name="scan-outline" size={80} color={Colors.textDim} />
                <Text style={styles.scanText}>Point at any gym outfit</Text>
            </View>

            <View style={styles.styleActions}>
                <TouchableOpacity
                    style={[styles.styleBtn, { backgroundColor: activeColor }]}
                    onPress={() => Alert.alert('Camera', 'Opening camera to scan your outfit...')}
                >
                    <Ionicons name="camera" size={24} color="white" />
                    <Text style={styles.styleBtnText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.styleBtnSecondary}
                    onPress={() => Alert.alert('Gallery', 'Opening photo gallery...')}
                >
                    <Ionicons name="images" size={24} color="white" />
                    <Text style={styles.styleBtnText}>Upload</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sourcedContainer}>
                <Text style={styles.sourcedTitle}>Recently Sourced</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {MOCK_PRODUCTS.slice(0, 3).map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.sourcedItem}
                            onPress={() => setSelectedItem({ type: 'shop', data: product })}
                        >
                            <Image source={product.image} style={styles.sourcedImage} />
                            <View style={styles.sourcedInfo}>
                                <Text style={styles.sourcedName} numberOfLines={1}>{product.title}</Text>
                                <Text style={styles.sourcedPrice}>${product.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            {renderHeader()}

            <View style={styles.mainContent}>
                {activeTab === 'shop' && renderShop()}
                {activeTab === 'live' && renderLive()}
                {activeTab === 'forum' && renderForum()}
                {activeTab === 'style' && renderStyleMatch()}
            </View>

            {renderDetailModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 1,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    tabBar: {
        gap: 12,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 6,
    },
    tabLabel: {
        fontWeight: '600',
        fontSize: 14,
    },
    mainContent: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    // Shop Styles
    categoriesContainer: {
        marginBottom: 20,
    },
    categoryChip: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    categoryText: {
        color: '#ccc',
        fontSize: 13,
        fontWeight: '600',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 20,
    },
    productCard: {
        width: '48%',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 4,
    },
    productImageContainer: {
        height: 140,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    conditionBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    conditionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    productInfo: {
        padding: 10,
    },
    productTitle: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        height: 36,
    },
    productPrice: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    originalPrice: {
        color: '#666',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    sellerName: {
        color: '#888',
        fontSize: 11,
    },
    // Live Styles
    liveGrid: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    liveCard: {
        width: '48%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        marginBottom: 16,
        position: 'relative',
    },
    liveThumbnail: {
        width: '100%',
        height: '100%',
    },
    liveOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    liveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF0055',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    viewerBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    viewerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    liveInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    liveTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    liveHost: {
        color: '#ccc',
        fontSize: 12,
    },
    // Forum Styles
    forumCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
    },
    voteColumn: {
        alignItems: 'center',
        marginRight: 12,
        width: 40,
    },
    voteCount: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 4,
    },
    postContent: {
        flex: 1,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        flexWrap: 'wrap',
    },
    postCategory: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    postDot: {
        color: '#666',
        fontSize: 10,
        marginHorizontal: 4,
    },
    postAuthor: {
        color: '#888',
        fontSize: 12,
    },
    postTime: {
        color: '#666',
        fontSize: 12,
    },
    postTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 22,
    },
    postActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 4,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#262626',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    actionText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '500',
    },
    // Style Match Styles
    styleContainer: {
        flex: 1,
        padding: 24,
    },
    cameraPlaceholder: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    scanLine: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        height: 2,
        shadowColor: 'white',
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    scanText: {
        color: '#666',
        marginTop: 16,
        fontSize: 16,
    },
    styleActions: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    styleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    styleBtnSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#262626',
        gap: 8,
    },
    styleBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sourcedContainer: {
        height: 160,
    },
    sourcedTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sourcedItem: {
        width: 120,
        marginRight: 12,
    },
    sourcedImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginBottom: 8,
    },
    sourcedInfo: {

    },
    sourcedName: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    sourcedPrice: {
        color: '#ccc',
        fontSize: 12,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    modalImage: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        marginBottom: 20,
    },
    detailsTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailsPrice: {
        color: 'white',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    detailsLabel: {
        color: '#888',
        fontSize: 16,
    },
    detailsValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    detailsBody: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
        marginTop: 8,
    },
    primaryButton: {
        backgroundColor: Colors.fun,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 32,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
