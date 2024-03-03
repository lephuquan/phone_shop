package com.PhoneShop.repository;

import com.PhoneShop.entity.UserEntity;
import com.PhoneShop.entity.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, Integer> {

    public List<UserRoleEntity> findByUsername(String username);
}
