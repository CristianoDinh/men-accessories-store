package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.BlogCreateRequest;
import com.isp392.ecommerce.dto.request.BlogUpdateRequest;
import com.isp392.ecommerce.dto.response.BlogResponse;
import com.isp392.ecommerce.entity.Blog;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.BlogMapper;
import com.isp392.ecommerce.repository.BlogRepository;
import com.isp392.ecommerce.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogService {

    BlogRepository blogRepository;
    UserRepository userRepository;
    BlogMapper blogMapper;

    public Blog createBlog(BlogCreateRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return blogRepository.save(Blog.builder()
                .title(request.getTitle())
                .image(request.getImage())
                .content(request.getContent())
                .createDate(new Date())
                .user(user)
                .build());

    }

    public BlogResponse getBlog(String id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));
        return BlogResponse.builder()
                .blogId(blog.getBlogId())
                .image(blog.getImage())
                .title(blog.getTitle())
                .content(blog.getContent())
                .createDate(blog.getCreateDate())
                .fullname(blog.getUser().getFullName())
                .userId(blog.getUser().getUserId())
                .build();
    }

//    public List<Blog> getAllBlog(int page, int limit) {
//        return blogRepository.findAll(PageRequest.of(page, limit)).getContent();
//    }

    public List<BlogResponse> getAllBlogs() {

        return blogRepository.findAll()
                .stream()
                .map(blog -> {
                    return BlogResponse.builder()
                            .blogId(blog.getBlogId())
                            .image(blog.getImage())
                            .title(blog.getTitle())
                            .content(blog.getContent())
                            .createDate(blog.getCreateDate())
                            .fullname(blog.getUser().getFullName())
                            .userId(blog.getUser().getUserId())
                            .build();
                }).collect(Collectors.toList());
    }

    public Blog updateBlog(String blogId, BlogUpdateRequest request) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_FOUND));

        blogMapper.updateBlog(blog, request);

        return blogRepository.save(blog);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public void deleteBlog(String blogId) {
        if (blogRepository.existsById(blogId))
            blogRepository.deleteById(blogId);
        else
            throw new AppException(ErrorCode.BLOG_NOT_FOUND);
    }

    //    @PreAuthorize("hasRole('USER')")
    public List<BlogResponse> getUserBlog(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getBlogs().stream().map(
                blog -> {
                    return BlogResponse.builder()
                            .blogId(blog.getBlogId())
                            .image(blog.getImage())
                            .title(blog.getTitle())
                            .content(blog.getContent())
                            .createDate(blog.getCreateDate())
                            .fullname(blog.getUser().getFullName())
                            .build();
                }
        ).toList();
    }
}
