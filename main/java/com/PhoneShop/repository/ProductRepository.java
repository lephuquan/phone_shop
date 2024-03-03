package com.PhoneShop.repository;

import com.PhoneShop.entity.CategoryEntity;
import com.PhoneShop.entity.ProductEntity;
import com.PhoneShop.entity.UserEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    public List<ProductEntity> findByCategory(@Param("categoryId") int categoryId);

    public List<ProductEntity> findImportantsByCategory(@Param("categoryId") int categoryId);

    public List<ProductEntity> findByCategoryWithSortASC(@Param("categoryId") int categoryId);

    public List<ProductEntity> findByCategoryWithSortDESC(@Param("categoryId") int categoryId);

    public  List<ProductEntity> findByCategoryWithSortByDateDESC(@Param("categoryId") int categoryId);

    //The name of the method needs to be set correctly (must contain the name of the entity attribute
    // --and do not use other random names)
    @Query("SELECT p FROM ProductEntity p WHERE p.name LIKE %:name%")
    public List<ProductEntity> findByNameProduct(@Param("name")String  name);

//    @Query("SELECT p.id, p.name, p.parameter, p.detail, p.description, p.productLaunchDate, p.categorydetailEntity.id, p.producerEntity.id, p.price, p.isImportant,  c.categoryEntity.id  FROM ProductEntity p left join CategorydetailEntity c  on p.categorydetailEntity.id = c.id  where c.categoryEntity.id  = :productId")
    @Query(value = "SELECT  * FROM phoneshop.product \n" +
            "left join phoneshop.categorydetail  on product.category_detail_id=categorydetail.id\n" +
            "  where categorydetail.category_id  = ?;", nativeQuery = true)
    public List<ProductEntity> findSimilarProduct(@Param("categoryId")int categoryId);




    public  List<ProductEntity> findByCategorydetailEntity_CategoryEntity_IdOrderByPriceAsc(int categoryId);
    public  List<ProductEntity> findByCategorydetailEntity_CategoryEntity_IdOrderByPriceDesc(int categoryId);
    public  List<ProductEntity> findByCategorydetailEntity_CategoryEntity_IdOrderByProductLaunchDateDesc(int categoryId);
}
