package com.community.productcommunity.repository;

import com.community.productcommunity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
//    Optional<User> findByUid(Long uid);

}
