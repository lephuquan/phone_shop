package com.PhoneShop.service;

import com.PhoneShop.entity.*;
import com.PhoneShop.model.*;
import com.PhoneShop.repository.*;
import org.aspectj.weaver.ast.Var;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryDetailRepository categoryDetailRepository;

    @Autowired
    private ProductPhotoRepository productPhotoRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private VariantRepository variantRepository;



    public Product findById(int id) {
        ProductEntity productEntity = productRepository.findById(id).get();
        Product product = new ModelMapper().map(productEntity, Product.class);
        if(!CollectionUtils.isEmpty(productEntity.getPromotionEntityList())) {
            Promotion promotion = getPromotionByProduct(productEntity.getPromotionEntityList());
            product.setPromotion(promotion);
        }
        if(!CollectionUtils.isEmpty(productEntity.getVariantEntityList())) {
            List<Variant> variantList = createVariantListWithPromotion(productEntity.getVariantEntityList());
            product.setVariantList(variantList);
        }

        return product;
    }

    private Promotion getPromotionByProduct(List<PromotionEntity> promotionEntityList) {
        for(PromotionEntity item : promotionEntityList) {
            Date currentDate = new Date();
            if(currentDate.compareTo(item.getStartDate()) >= 0 && currentDate.compareTo(item.getEndDate()) <=0) {
                return new ModelMapper().map(item, Promotion.class);
            }
        }
        return null;
    }

    private List<Variant> createVariantListWithPromotion(List<VariantEntity> variantList) {
        List<Variant> list = new ArrayList<>();
        for(VariantEntity item: variantList) {
            Variant variant = new ModelMapper().map(item, Variant.class);
            if(!CollectionUtils.isEmpty(item.getPromotionEntityList())) {
                Promotion promotion = getPromotionByProduct(item.getPromotionEntityList());
                variant.setPromotion(promotion);
            }
            list.add(variant);
        }
        return list;
    }

    public List<Product> findByFilter(int categoryId, String sort) {
        List<ProductEntity> categoryEntityList = productRepository.findByCategory(categoryId);//80
        if("price".equals(sort)) {
            categoryEntityList = productRepository.findByCategorydetailEntity_CategoryEntity_IdOrderByPriceAsc(categoryId);
        } else if("price-desc".equals(sort)) {
            categoryEntityList = productRepository.findByCategorydetailEntity_CategoryEntity_IdOrderByPriceDesc(categoryId);
        }else if("date".equals(sort)){
            categoryEntityList = productRepository.findByCategorydetailEntity_CategoryEntity_IdOrderByProductLaunchDateDesc(categoryId);
        }
        return new ModelMapper().map(categoryEntityList, new TypeToken<List<Product>>() {}.getType());
    }

    public List<Product> getProductsByName(String name) {
        List<ProductEntity> productEntityList = productRepository.findByNameProduct(name);
//        List<CategorydetailEntity> categorydetailEntityList = categoryDetailRepository.findByNameCategory(name);
//        List<SearchItem> searchItemList = createSearchItemForProduct(productEntityList);
        //searchItemList.addAll(createSearchItemForCategory(categorydetailEntityList));
//        return searchItemList;
        return new ModelMapper().map(productEntityList, new TypeToken<List<Product>>() {}.getType());
    }

//    private List<SearchItem> createSearchItemForProduct(List<ProductEntity> productEntityList) {
//        List<SearchItem> searchItemList = new ArrayList<>();
//        for(ProductEntity item: productEntityList) {
//            SearchItem searchItem = new SearchItem();
//            searchItem.setName(item.getName());
//            searchItem.setPrice(item.getPrice());
//            searchItem.setPhoto(item.getProductphotoEntityList()
//                    .stream().filter(photo -> photo.getIsDefault())
//                    .findFirst().orElse(new ProductphotoEntity())
//                    .getPhoto());
//            searchItem.setLink("product-detail?id=" + item.getId());
//            searchItemList.add(searchItem);
//        }
//        return searchItemList;
//    }

    public List<Product> searchProduct(String name) {
        List<ProductEntity> productEntityList = productRepository.findByNameProduct(name);
        return new ModelMapper().map(productEntityList, new TypeToken<List<Product>>() {}.getType());
    }

    public List<Product> findSimilarProducts(int categoryId){
        List<ProductEntity> productEntityList = productRepository.findSimilarProduct(categoryId);
        return new ModelMapper().map(productEntityList, new TypeToken<List<Product>>() {}.getType());
    }

    private List<SearchItem> createSearchItemForCategory(List<CategorydetailEntity> categorydetailEntityList) {
        List<SearchItem> searchItemList = new ArrayList<>();
        for(CategorydetailEntity item: categorydetailEntityList) {
            SearchItem searchItem = new SearchItem();
            searchItem.setName(item.getName());
            searchItem.setLink("category-detail?id=" + item.getId());
            searchItemList.add(searchItem);
        }
        return searchItemList;
    }

    public List<ImportantProduct> findImportantProducts() {
        List<ImportantProduct> importantProductList = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();
        List<CategoryEntity> categoryEntityList = categoryRepository.findAll();
        for(CategoryEntity categoryEntity: categoryEntityList) {
            List<ProductEntity> productEntityList = productRepository.findImportantsByCategory(categoryEntity.getId());

            Category category = modelMapper.map(categoryEntity, Category.class);
            List<Product> productList = modelMapper.map(productEntityList, new TypeToken<List<Product>>() {}.getType());
            importantProductList.add(new ImportantProduct(productList, category));
        }
        return importantProductList;
    }

    public List<Productphoto> findSlideImageList() {
        List<ProductphotoEntity> productphotoEntityList = productPhotoRepository.findByproductEntity_Id(100);
        return new ModelMapper().map(productphotoEntityList, new TypeToken<List<Productphoto>>() {}.getType());
    }

    public List<Product> getAllProducts() {
        List<ProductEntity> productEntityList = productRepository.findAll();
        return new ModelMapper().map(productEntityList, new TypeToken<List<Product>>() {}.getType());
    }

    public Product addProduct(Product product) {
        ModelMapper modelMapper = new ModelMapper();
        ProductEntity productEntity = modelMapper.map(product, ProductEntity.class);
        productEntity.setProductLaunchDate(new Date());
        productEntity.setCategorydetailEntity(categoryDetailRepository.getById(product.getCategoryDetail().getId()));
        productEntity.setProducerEntity(producerRepository.getById(product.getProducer().getId()));
        ProductEntity newProductEntity = productRepository.save(productEntity);

        //Handle for productPhoto
        List<Productphoto> productphotoList = product.getProductphotoList();
        for(Productphoto item: productphotoList) {
            ProductphotoEntity productphotoEntity = modelMapper.map(item, ProductphotoEntity.class);
            productphotoEntity.setIsDefault(item.getIsDefault());
            productphotoEntity.setProductEntity(newProductEntity);
            productPhotoRepository.save(productphotoEntity);
        }

        //Handle for variantList
        List<Variant> variantList = product.getVariantList();
        for(Variant variant: variantList) {
            VariantEntity variantEntity = modelMapper.map(variant, VariantEntity.class);
            variantEntity.setProductEntity(newProductEntity);
            variantRepository.save(variantEntity);
        }
        return findById(newProductEntity.getId());
    }

    public Product updateProduct(Product product) {
        ModelMapper modelMapper = new ModelMapper();
        // Get old product
        ProductEntity productEntity = productRepository.getById(product.getId());
        productEntity.setName(product.getName());
        productEntity.setParameter(product.getParameter());
        productEntity.setDetail(product.getDetail());
        productEntity.setDescription(product.getDescription());
        productEntity.setPrice(product.getPrice());
        productEntity.setProductLaunchDate(new Date());
        productEntity.setCategorydetailEntity(categoryDetailRepository.getById(product.getCategoryDetail().getId()));
        productEntity.setProducerEntity(producerRepository.getById(product.getProducer().getId()));

        ProductEntity newProductEntity = productRepository.save(productEntity);

        //Remove the old photos
        List<ProductphotoEntity> productphotoEntityList = productPhotoRepository.findByproductEntity_Id(product.getId());
        productPhotoRepository.deleteAll(productphotoEntityList);
        //Add the new photo
        List<Productphoto> productphotoList = product.getProductphotoList();
        for(Productphoto item: productphotoList) {
            ProductphotoEntity productphotoEntity = modelMapper.map(item, ProductphotoEntity.class);
            productphotoEntity.setIsDefault(item.getIsDefault());
            productphotoEntity.setProductEntity(newProductEntity);
            productPhotoRepository.save(productphotoEntity);
        }

        //Handle for variantList
        //Remove the old photos
        List<VariantEntity> variantEntityList = variantRepository.findByproductEntity_Id(product.getId());
        variantRepository.deleteAll(variantEntityList);
        List<Variant> variantList = product.getVariantList();
        for(Variant variant: variantList) {
            VariantEntity variantEntity = modelMapper.map(variant, VariantEntity.class);
            variantEntity.setProductEntity(newProductEntity);
            variantRepository.save(variantEntity);
        }
        return findById(newProductEntity.getId());
    }

    public boolean deleteProduct(int id) {
        productRepository.deleteById(id);
        return true;
    }



}
